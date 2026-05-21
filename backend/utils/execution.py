import pandas as pd
import duckdb
import plotly
import plotly.express as px
import plotly.graph_objects as go
import json
import traceback

import builtins

def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    allowed_modules = ['pandas', 'duckdb', 'plotly', 'json', 'numpy', 'datetime', 'statsmodels', 'scipy', 'sklearn', 'math']
    base_name = name.split('.')[0]
    if base_name not in allowed_modules:
        raise ImportError(f"Importing module '{name}' is not allowed in this sandbox for security reasons.")
    return __import__(name, globals, locals, fromlist, level)

# Build a secure builtins environment (stripping dangerous functions)
safe_builtins = {k: v for k, v in vars(builtins).items() if k not in ['eval', 'exec', 'open', '__import__', 'exit', 'quit', 'input']}
safe_builtins['__import__'] = safe_import

def execute_sandbox(code: str, filepath: str) -> tuple[str, dict, str]:
    """
    Executes AI-generated Python code in a sandboxed environment.
    Catches errors to feed back to the LLM.
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        return None, None, f"Failed to load dataset: {str(e)}"
        
    # Sandbox environment variables
    local_vars = {
        'df': df,
        'pd': pd,
        'duckdb': duckdb,
        'px': px,
        'go': go,
        'json': json,
        'result_text': None,
        'plot_json': None
    }
    
    try:
        # Execute the code securely (within the constraints of our VM context)
        exec(code, {"__builtins__": safe_builtins}, local_vars)
        
        result_text = local_vars.get('result_text')
        plot_json = local_vars.get('plot_json')
        
        # Convert plot to a JSON-serializable dict
        if plot_json is not None:
            if hasattr(plot_json, 'to_json'):
                # Plotly Figure -> JSON string -> dict (handles numpy/datetime serialization safely)
                plot_json = json.loads(plot_json.to_json())
            elif isinstance(plot_json, str):
                try:
                    plot_json = json.loads(plot_json)
                except (json.JSONDecodeError, ValueError):
                    plot_json = None
                
        if result_text is None:
            return None, None, "Code executed but 'result_text' was not defined."
            
        return result_text, plot_json, None
        
    except Exception as e:
        error_trace = traceback.format_exc()
        return None, None, f"{type(e).__name__}: {str(e)}\nTraceback:\n{error_trace}"
