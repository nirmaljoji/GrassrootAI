from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent
from typing import Literal
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState, END
from langgraph.types import Command
# from .agent_outreach_social import agent_outreach_social
from .agent_outreach_volunteer import VolunteerOutreachTool
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser
from .resource_search_tool import SearchTool
from .outreach_social_tool import OutreachSocialTool
from .agent_permit import PermitSearchTool
from .schedule_tool import ScheduleTool
from .budget_tool import BudgetTool

resourse_search_tool = SearchTool()
outreach_social_tool = OutreachSocialTool()
schedule_tool = ScheduleTool()
budget_tool = BudgetTool()

members = ["Budget", "Resources", "Social_Outreach", "Volunteer_Outreach", "Schedule", "Permits"]
options = members + ["FINISH"]

# Our team supervisor is an LLM node. It just picks the next agent to process
# and decides when the work is completed
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

schedule_prompt = """
You are an event scheduling expert. When given event details, create a detailed timeline that:
1. Breaks down all major tasks and activities
2. Specifies the duration and sequence of each task
3. Identifies dependencies between tasks
4. Allocates appropriate time buffers
5. Considers resource availability

First make a call to the tool to get the above information by making use of: schedule_tool

Provide the schedule in a clear format. Do not add any extra line. Give me the points alone. Do not add any starter text. If there more
than 5 points, just categorise and give me max 5 points.

Example Query: Create a schedule for a community food drive
Response:
- Permit Applications: 10 days
- Venue Booking: 7 days
- Initial Announcements: 5 days
- Volunteer Recruitment: 5 days
- Social Media Campaign: 4 days
- Donation Collection: 4 days
- Equipment Setup: 2 days
- Event Day: 1 day
"""

system_prompt = (
    "You are a supervisor tasked with managing a conversation between the"
    " following workers:  {members}. Given the following user request,"
    " respond with the worker to act next. Each worker will perform a"
    " task and respond with their results and status. When finished,"
    " respond with FINISH."
)

volunteer_outreach_prompt = (
    "You are a volunteer coordination expert. "
    "When asked about any volunteer event, create a compelling volunteer outreach email that:\n"
    "1. Clearly describes the event and its purpose.\n"
    "2. Specifies volunteer roles and requirements.\n"
    "3. Includes time commitments and scheduling details.\n"
    "4. Highlights the impact and benefits of volunteering.\n"
    "5. Provides clear instructions for volunteers to reply directly via email.\n\n"
    "High priority items:\n"
    "1. The email must always include the terms 'Subject:' and 'Body:'.\n"
    "2. The email must always end with 'Best regards, The Event Team.'\n"
    "3. The email must not contain any placeholders.\n"
    "4. DO NOT include sign-up links; instruct volunteers to reply to the email.\n"
    "5. DO NOT add lines like 'Feel free to customize…'.\n"
    "6. The email should only have a subject and body, no other text.\n"
    "Keep the tone friendly and enthusiastic while maintaining professionalism."
)

permit_prompt = (
    "You are a permit planning expert for social initiatives.\n\n"
    "First, make a call to the tool to get the permit requirements for the event: permit_search_tool\n\n"
    "When asked about an event:\n"
    "1. Determine the exact permits required based on the event details such as date, time, and location.\n"
    "2. Consider events like blood donation drives, food drives, park cleanups, etc.\n"
    "3. Provide the answer as a list, with each permit (and a brief description if needed) on a separate line.\n\n"
    "And give the answer alone, do not add any extra lines, follow the same format as the example provided.\n\n"
    "Example Q: What permits are required for a blood donation drive on July 4 at 456 Park Ave?\n"
    "Answer:\n"
    "- Health Department Permit: Ensures compliance with local health codes.\n"
    "- Temporary Event Permit: Authorizes use of public space for the event.\n"
)

budget_prompt = """You are an expert budget planning assistant specializing in all types of events. When a user asks about budget allocation:

1. Use the calculate_budget_breakdown tool to get the budget amount and event type
2. Based on the event type, first determine ALL relevant budget categories that would be needed. Consider:
   - The specific nature and purpose of the event
   - Standard requirements for this type of event
   - Special equipment or resources typically needed
   - Both essential and optional components
   
3. For each identified category:
   - Assign an appropriate percentage based on importance and typical costs
   - Calculate the actual dollar amount

4. Your response should:
   - List all relevant budget categories specific to the event type
   - Show percentage and dollar amount for each category
   - Ensure percentages sum to exactly 100%
   - Group related items logically

Remember that categories should be specifically tailored to the exact event type provided, not using generic templates.
Only output the answer, no other text.
If you need any clarification about the event type or special requirements, ask the user.
"""

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

volunteer_outreach_tool = VolunteerOutreachTool()

outreach_volunteer_agent = create_react_agent(
    llm,
    tools=[volunteer_outreach_tool],
    prompt=volunteer_outreach_prompt
)


def outreach_volunteer_node(state: State) -> Command[Literal["Supervisor"]]:
    result = outreach_volunteer_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Volunteer_Outreach")
            ]
        },
        goto="Schedule",
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
        goto="Volunteer_Outreach",
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
        goto="Social_Outreach",
    )

schedule_agent = create_react_agent(
    llm, tools=[schedule_tool], prompt=schedule_prompt
)

def schedule_node(state: State) -> Command[Literal["Supervisor"]]:
    result = schedule_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Schedule")
            ]
        },
        goto="Budget",
    )

permit_agent = create_react_agent(
    llm,
    tools=[PermitSearchTool()],
    prompt=permit_prompt
)

def permit_node(state: dict) -> Command[str]:
    """
    This node represents the permits agent. It invokes the permit_agent using the given
    state (which contains prior messages and context) and posts the result as a message with
    the name "Permits". The agent then yields control back to the supervisor.
    """
    result = permit_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Permits")
            ]
        },
        goto="Supervisor",
    )

budget_agent = create_react_agent(
    llm,
    tools=[budget_tool],
    prompt=budget_prompt
)

def budget_node(state: State) -> Command[Literal["Supervisor"]]:
    result = budget_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="Budget")
            ]
        },
        goto="Permits",
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
    builder.add_node("Schedule", schedule_node)
    builder.add_node("Permits", permit_node)
    builder.add_node("Budget", budget_node)
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