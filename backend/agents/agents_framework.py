from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent
from typing import Literal
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState, END
from langgraph.types import Command
from agent_outreach_social import agent_outreach_social
from agent_resources import agent_resources
from agent_outreach_volunteer import agent_outreach_volunteer
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
# from agent_supervisor import supervisor_node


members = ["resources", "Social Outreach", "Volunteer Outreach"]
# Our team supervisor is an LLM node. It just picks the next agent to process
# and decides when the work is completed
options = members + ["FINISH"]


system_prompt = (
    "You are a supervisor tasked with managing a conversation between the"
    f" following workers: {members}. Given the following user request,"
    " respond with the worker to act next. Each worker will perform a"
    " task and respond with their results and status. When finished,"
    " respond with FINISH."
)


class Router(TypedDict):
    """Worker to route to next. If no workers needed, route to FINISH."""

    next: Literal[*options]

llm = ChatOpenAI(model="gpt-4o-mini")

class State(MessagesState):
    next: str

outreach_volunteer_agent = create_react_agent(
    llm, tools=[agent_outreach_volunteer], prompt=""
)


def outreach_volunteer_node(state: State) -> Command[Literal["supervisor"]]:
    result = outreach_volunteer_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="researcher")
            ]
        },
        goto="supervisor",
    )



outreach_social_agent = create_react_agent(
    llm, tools=[agent_outreach_social], prompt="DO NOT do any math."
)


def outreach_social_node(state: State) -> Command[Literal["supervisor"]]:
    result = outreach_social_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="researcher")
            ]
        },
        goto="supervisor",
    )


resources_agent = create_react_agent(
    llm, tools=[agent_resources], prompt="DO NOT do any math."
)


def resources_node(state: State) -> Command[Literal["supervisor"]]:
    result = resources_agent.invoke(state)
    return Command(
        update={
            "messages": [
                HumanMessage(content=result["messages"][-1].content, name="researcher")
            ]
        },
        goto="supervisor",
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

builder = StateGraph(State)
builder.add_edge(START, "supervisor")
builder.add_node("supervisor", supervisor_node)
builder.add_node("resources", resources_node)
builder.add_node("Social Outreach", outreach_social_node)
builder.add_node("Volunteer Outreach", outreach_volunteer_node)
graph = builder.compile()

# from IPython.display import Image

# # Generate and save the graph visualization as PNG
# graph_png = graph.get_graph().draw_mermaid_png()
# with open('graph_visualization.png', 'wb') as f:
#     f.write(graph_png)


for s in graph.stream(
    {"messages": [("user", "I want to organize a blood camp in North Carolina")]}, subgraphs=True
):
    print(s)
    print("----")