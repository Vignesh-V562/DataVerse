import os
import re
from groq import AsyncGroq

# Initialize the async Groq client
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY", ""))

# Using Llama 3 70B for high-quality code generation
MODEL_NAME = os.getenv("MODEL_NAME", "llama-3.1-8b-instant")

SYSTEM_PROMPT_TEMPLATE = """
You are an expert Data Scientist, Business Analyst, and Python developer working inside a product called DataVerse.
You have access to a pandas DataFrame named `df`.
Schema information:
{schema_info}

First 3 rows:
{preview_data}

Your task is to write Python code to answer the user's question.
Rules:
1. You MUST define a variable named `result_text` (string) containing your answer formatted in markdown. 
   - Start with a **brief summary** of the results (1-2 sentences).
   - Then show the data (tables, numbers) clearly.
   - End with a **"Key Insights"** section containing 2-4 bullet points of hidden patterns, anomalies, business implications, or actionable recommendations you observe in the results. Think like a senior data analyst presenting to a C-suite executive.
   - Example structure:
     ```
     **Revenue by Region**
     
     | Region | Revenue |
     | --- | --- |
     | North | $1.2M |
     
     **Key Insights**
     - 🔍 The North region dominates with 45% of total revenue, suggesting strong market penetration.
     - ⚠️ The South region declined 12% quarter-over-quarter — investigate potential churn drivers.
     - 💡 Consider reallocating marketing budget from East (saturated) to West (high growth potential).
     ```
2. If the user asks for a chart, or if a visualization would help explain the data, create a Plotly figure and assign it directly to a variable named `plot_json` (e.g., `plot_json = fig`). DO NOT convert it to JSON or HTML yourself (NEVER use fig.to_html() or fig.to_json()). DO NOT append the chart data to `result_text`. Our system renders `plot_json` automatically.
3. For heavy data processing, you can use DuckDB via `duckdb.query('SELECT ... FROM df').df()` for blazing fast performance.
4. Do not print anything. Only assign the variables.
5. Do not load the data yourself, `df` is already in memory.
6. Make sure to wrap your code in a standard python markdown block (```python ... ```).
7. When converting or parsing date columns, NEVER hardcode string formats (like '%m/%d/%Y'). ALWAYS use `pd.to_datetime(df['col'], format='mixed', errors='coerce')` to prevent formatting errors.
8. When using Pandas resample or Grouper, note that Pandas >= 2.2 deprecated 'M', 'Q', 'Y' frequency aliases. You MUST use 'ME', 'QE', 'YE' (Month End, Quarter End, Year End) instead.
9. When building markdown tables in result_text, construct them manually with string formatting. Do NOT use df.to_markdown() as the tabulate package may not be available.

User Question: {question}
"""

def extract_code(text: str) -> str:
    """Extract python code from markdown block."""
    match = re.search(r'```python\n(.*?)\n```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

async def generate_code(question: str, summary: dict, error_feedback: str = None) -> str:
    """Generate Python code using Groq async API."""
    schema_info = "\n".join([f"- {col}: {dtype}" for col, dtype in summary.get('data_types', {}).items()])
    preview_data = str(summary.get('preview', [])) # type: ignore
    
    prompt = SYSTEM_PROMPT_TEMPLATE.format(
        schema_info=schema_info,
        preview_data=preview_data,
        question=question
    )
    
    if error_feedback:
        prompt += f"\n\nYOUR PREVIOUS CODE FAILED WITH THIS ERROR:\n{error_feedback}\n\nPlease fix the code and try again."
        
    response = await client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2, # Low temperature for more deterministic code generation
    )
    
    return extract_code(response.choices[0].message.content)
