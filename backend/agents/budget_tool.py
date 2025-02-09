from pydantic import BaseModel, Field
from langchain.tools import BaseTool
from typing import Type
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool

class BudgetInput(BaseModel):
    budget_str: str = Field(description="The budget amount and event type in the format 'amount:event_type'.")

class BudgetTool(BaseTool):
    name: str = "budget_tool"
    description: str = "Calculates budget allocation for a given event."
    args_schema: Type[BaseModel] = BudgetInput

    def _run(self, budget_str: str) -> str:
        """Calculate budget allocation based on the provided amount and event type."""
        try:
            amount, event_type = budget_str.split(':')
            amount = float(amount.replace('$', '').replace(',', ''))

            # General budget breakdown prompt
            response = f"""
You are an expert budget planning assistant specializing in all types of events. When a user asks about budget allocation:

1.⁠ ⁠Use the provided budget amount and event type to determine relevant budget categories.
2.⁠ ⁠Assign an appropriate percentage based on importance and typical costs.
3.⁠ ⁠Calculate the actual dollar amount for each category.

For example, if the user provides a budget of ${amount:,.2f} for a '{event_type}', you might allocate it as follows:

•⁠  ⁠Venue and setup: 10%, ${amount * 0.10:,.2f}
•⁠  ⁠Equipment and supplies: 25%, ${amount * 0.25:,.2f}
•⁠  ⁠Staff and coordination: 15%, ${amount * 0.15:,.2f}
•⁠  ⁠Marketing and outreach: 15%, ${amount * 0.15:,.2f}
•⁠  ⁠Administrative costs: 10%, ${amount * 0.10:,.2f}
•⁠  ⁠Contingency fund: 25%, ${amount * 0.25:,.2f}

Remember that categories should be specifically tailored to the exact event type provided, not using generic templates.
Only output the answer, no other text.
If you need any clarification about the event type or special requirements, ask the user.
"""
            return response.strip()  # Return the response without leading/trailing whitespace
            
        except ValueError:
            return "Invalid input format. Please use 'amount:event_type' format (e.g. '15000:community event')"

    async def _arun(self, budget_str: str) -> str:
        """Use this tool asynchronously."""
        raise NotImplementedError("Async not implemented")