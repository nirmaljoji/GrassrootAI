from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent
from typing import Literal
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState, END
from langgraph.types import Command
from .agent_outreach_social import agent_outreach_social
from .agent_outreach_volunteer import agent_outreach_volunteer
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser
from .resource_search_tool import SearchTool
from .outreach_social_tool import OutreachSocialTool
# from agent_supervisor import supervisor_node
resourse_search_tool = SearchTool()
outreach_social_tool = OutreachSocialTool()

members = ["Resources", "Social_Outreach", "Volunteer_Outreach"]
# Our team supervisor is an LLM node. It just picks the next agent to process
# and decides when the work is completed
options = members + ["FINISH"]
llm = ChatOpenAI(model="gpt-3.5-turbo")

resource_prompt = """You are a resource planning expert for social initiatives. 

First make a call to the tool to get the latest information regardin the event: resource_search_tool

When asked about an event:
1. Identify all required resources across categories: 
   - Personnel (medical staff, volunteers)
   - Equipment & supplies
   - Permits/licenses
   - Facilities/venue
   - Transportation
   - Safety requirements

And give the answer alone, do not add any extra lines, follow the same format as the examples provided.

Example Q: What resources are needed for a community food distribution event?
Answer:
- Event Coordinator (1) 
- Food Safety Supervisor (1) 
- Volunteers (10-15) 
- Commercial grade refrigeration units
- Food storage containers and bags
- PPE (gloves, hairnets, aprons)
- Hand sanitizing stations


Example Q: What do I need to organize a mobile vaccination clinic?
Answer:
- Licensed nurses
- Medical director
- Registration staff 
- Post-vaccination observers 
- Medical-grade refrigerators for vaccine storage
- Vaccination supplies (needles, syringes, alcohol wipes)
- Emergency response kit with epinephrine
- Laptops/tablets for patient registration
- Privacy screens
- Medical practice license
- Vaccine administration certification
- Mobile clinic permit
"""


outreach_social_prompt = """You are a outreach social expert for social initiatives. 

First make a call to the tool to get the information regarding Facebook groupname: outreach_social_tool

Output the group names alone in each line.  Follow the same format as provided in the Examples

Example Q: What resources are needed for a community food distribution event?
Answer:
- group_name 1
- group_name 2
- group_name 3
- group_name 4

Example Q: How do i organize a blood donation camp in North Carolina?
Answer:
- group_name 1
- group_name 2
- group_name 3
- group_name 4
"""

system_prompt = (
    "You are a supervisor tasked with managing a conversation between the"
    " following workers:  {members}. Given the following user request,"
    " respond with the worker to act next. Each worker will perform a"
    " task and respond with their results and status. When finished,"
    " respond with FINISH."
)



prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="messages"),
        (
            "system",
            "Given the conversation above, who should act next?"
            " Or should we FINISH? Select one of: {options}",
        ),
    ]
).partial(options=str(options), members=", ".join(members))



class Router(TypedDict):
    """Worker to route to next. If no workers needed, route to FINISH."""

    next: Literal[*options]

llm = ChatOpenAI(model="gpt-4o-mini")

class State(MessagesState):
    next: str

outreach_volunteer_agent = create_react_agent(
    llm, tools=[agent_outreach_volunteer], prompt=""
)


def outreach_volunteer_node(state: State) -> Command[Literal["Supervisor"]]:
    result = outreach_volunteer_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Volunteer_Outreach")
            ]
        },
        goto="Supervisor",
    )



outreach_social_agent = create_react_agent(
    llm, tools=[outreach_social_tool], prompt=outreach_social_prompt
)


def outreach_social_node(state: State) -> Command[Literal["Supervisor"]]:
    result = outreach_social_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Social_Outreach")
            ]
        },
        goto="Supervisor",
    )


resources_agent = create_react_agent(
    llm, tools=[resourse_search_tool], prompt=resource_prompt
)


def resources_node(state: State) -> Command[Literal["Supervisor"]]:
    result = resources_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Resources")
            ]
        },
        goto="Supervisor",
    )

def supervisor_node(state: State) -> Command[Literal[*members, "__end__"]]:
    messages = [
        {"role": "system", "content": system_prompt},
    ] + state["messages"]
    response = llm.with_structured_output(Router).invoke(messages)

    goto = response["next"]
    if goto == "FINISH":
        goto = END

    return Command(goto=goto, update={"next": goto})

def initialize_graph():
    builder = StateGraph(State)
    builder.add_edge(START, "Supervisor")
    builder.add_node("Supervisor", supervisor_node)
    builder.add_node("Resources", resources_node)
    builder.add_node("Social_Outreach", outreach_social_node)
    builder.add_node("Volunteer_Outreach", outreach_volunteer_node)

    builder.set_entry_point("Supervisor")
    return builder.compile()

def generate_graph_visualization(graph):
    from IPython.display import Image
    graph_png = graph.get_graph().draw_mermaid_png()
    with open('graph_visualization.png', 'wb') as f:
        f.write(graph_png)

def process_user_message(user_message: str):
    graph = initialize_graph()
    responses = []
    for s in graph.stream(
        {
            "messages": [
                HumanMessage(content=user_message)
            ]
        }, config={"recursion_limit": 20}
    ):
        if "__end__" not in s:
            responses.append(str(s))
    return responses