import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import requests
from io import StringIO
import io
import os
import uuid

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR, exist_ok=True)

def generate_summary(df: pd.DataFrame) -> dict:
    """Generate statistical summary for the frontend."""
    # Convert dtypes to string format for JSON serialization
    dtypes_dict = {col: str(dtype) for col, dtype in df.dtypes.items()}
    
    # Calculate null counts
    null_counts = df.isnull().sum().to_dict()
    
    summary = {
        "total_rows": len(df),
        "total_columns": len(df.columns),
        "columns": list(df.columns),
        "data_types": dtypes_dict,
        "null_counts": null_counts,
        "preview": df.head(3).to_dict(orient='records') # Extract first 3 rows for Context Builder
    }
    return summary

def save_and_process_file(file_content: bytes, filename: str) -> tuple[dict, str]:
    """Process uploaded file, save it to disk for memory efficiency, and return summary."""
    ext = os.path.splitext(filename)[1].lower()
    file_id = str(uuid.uuid4())
    save_path = os.path.join(DATA_DIR, f"{file_id}{ext}")
    
    with open(save_path, "wb") as f:
        f.write(file_content)
        
    try:
        if ext == '.csv':
            df = pd.read_csv(save_path)
        elif ext in ['.xls', '.xlsx']:
            df = pd.read_excel(save_path)
            # convert excel to csv for duckdb compatibility later
            csv_path = os.path.join(DATA_DIR, f"{file_id}.csv")
            df.to_csv(csv_path, index=False)
            if os.path.exists(save_path):
                os.remove(save_path)
            save_path = csv_path
        else:
            raise ValueError(f"Unsupported file extension: {ext}")
            
        summary = generate_summary(df)
        return summary, save_path
    except Exception as e:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise Exception(f"Failed to process file: {str(e)}")

def save_and_process_url(url: str) -> tuple[dict, str]:
    """Process URL to extract tabular data, save to disk, return summary."""
    try:
        df = None
        # 1. Try reading directly with pandas (handles CSV URLs, JSON, HTML tables)
        try:
            dfs = pd.read_html(url)
            if dfs:
                df = max(dfs, key=len)
        except Exception:
            pass 
            
        if df is None:
            # 2. Fallback: Request the content
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', '').lower()
            
            if 'csv' in content_type:
                df = pd.read_csv(StringIO(response.text))
            else:
                # 3. Fallback: Parse HTML manually with BeautifulSoup
                soup = BeautifulSoup(response.text, 'html.parser')
                tables = soup.find_all('table')
                
                if not tables:
                    raise ValueError("No tabular data found at this URL.")
                    
                dfs = pd.read_html(StringIO(str(tables[0])))
                df = dfs[0]
                
        # Save df to CSV
        file_id = str(uuid.uuid4())
        save_path = os.path.join(DATA_DIR, f"{file_id}.csv")
        df.to_csv(save_path, index=False)
        
        return generate_summary(df), save_path
        
    except Exception as e:
        raise Exception(f"Failed to scrape URL: {str(e)}")
