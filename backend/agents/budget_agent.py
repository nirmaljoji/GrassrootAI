from dotenv import load_dotenv
_ = load_dotenv()

from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]

@tool
def calculate_budget_breakdown(budget_str: str) -> str:
    """
    Calculate budget breakdown given total amount and event details.
    Input format: 'amount:event_type' e.g. '15000:blood donation drive'
    """
    try:
        amount, event_type = budget_str.split(':')
        amount = float(amount.replace('$', '').replace(',', ''))
        return f"Total Budget: ${amount:,.2f}\nEvent Type: {event_type}"
        
    except ValueError:
        return "Invalid input format. Please use 'amount:event_type' format (e.g. '15000:blood donation drive')"

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
            if not t['name'] in self.tools:
                print("\n ....bad tool name....")
                result = "bad tool name, retry"
            else:
                result = self.tools[t['name']].invoke(t['args'])
            results.append(ToolMessage(tool_call_id=t['id'], name=t['name'], content=str(result)))
        print("Back to the model!")
        return {'messages': results}

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

For example, 
Query: I have $15000 for a blood donation drive. How should I allocate this budget?:
Answer:
- Venue and setup: 10%, $1500
- Medical equipment and supplies: 20%, $3000
- Staff/medical professionals: 10%, $1500
- Refreshments for donors: 10%, $1500
- Marketing and awareness: 10%, $1500
- Registration systems: 10%, $1500
- Safety and sanitization: 10%, $1500
- Emergency provisions: 10%, $1500
- Volunteer coordination: 10%, $1500

Remember that categories should be specifically tailored to the exact event type provided, not using generic templates.
Only output the answer, no other text.
If you need any clarification about the event type or special requirements, ask the user.
"""

model = ChatOpenAI(model="gpt-4o-mini")
abot = Agent(model, [calculate_budget_breakdown], system=budget_prompt)



# Test the budget planner
messages = [HumanMessage(content="I have $15000 for a blood donation drive. How should I allocate this budget?")]
result = abot.graph.invoke({"messages": messages})

if result and 'messages' in result and len(result['messages']) > 0:
    # print("\nFinal Response:")
    print(result['messages'][-1].content)