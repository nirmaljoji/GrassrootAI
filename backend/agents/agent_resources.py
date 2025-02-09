from dotenv import load_dotenv
_ = load_dotenv()

from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatPerplexity

from search_tool import SearchTool

tool = SearchTool()

class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]


class Agent:

    def __init__(self, model, tools, system=""):
        self.system = system
        graph = StateGraph(AgentState)
        graph.add_node("llm", self.call_openai)
        graph.add_node("action", self.take_action)
        graph.add_conditional_edges(
            "llm",
            self.exists_action,
            {True: "action", False: END}
        )
        graph.add_edge("action", "llm")
        graph.set_entry_point("llm")
        self.graph = graph.compile()
        self.tools = {t.name: t for t in tools}
        self.model = model.bind_tools(tools)

    def exists_action(self, state: AgentState):
        result = state['messages'][-1]
        return len(result.tool_calls) > 0

    def call_openai(self, state: AgentState):
        messages = state['messages']
        if self.system:
            messages = [SystemMessage(content=self.system)] + messages
        message = self.model.invoke(messages)
        return {'messages': [message]}

    def take_action(self, state: AgentState):
        tool_calls = state['messages'][-1].tool_calls
        results = []
        for t in tool_calls:
            print(f"Calling: {t}")
            if not t['name'] in self.tools:      # check for bad tool name from LLM
                print("\n ....bad tool name....")
                result = "bad tool name, retry"  # instruct LLM to retry if bad
            else:
                result = self.tools[t['name']].invoke(t['args'])
            results.append(ToolMessage(tool_call_id=t['id'], name=t['name'], content=str(result)))
        print("Back to the model!")
        return {'messages': results}

prompt = """You are a resource planning expert for social initiatives. When asked about an event:
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

model = ChatOpenAI(model="gpt-4o-mini")  #reduce inference cost
abot = Agent(model, [tool], system=prompt)


messages = [HumanMessage(content="What is the permit required to host  food donation drive in North Carolina, US")]
result = abot.graph.invoke({"messages": messages})


print(result['messages'][-1].content)