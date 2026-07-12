from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz
import chromadb
import ollama

from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

app = FastAPI(title="AI Content Research Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Embedding Model
# -------------------------------

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# -------------------------------
# ChromaDB
# -------------------------------

db_client = chromadb.Client()

collection = db_client.get_or_create_collection(
    name="documents"
)


# -------------------------------
# Request Models
# -------------------------------

class Question(BaseModel):
    question: str


class PromptRequest(BaseModel):
    prompt: str


# -------------------------------
# Root
# -------------------------------

@app.get("/")
def home():
    return {
        "project": "AI Content Research Assistant",
        "llm": "Ollama - Llama3.2",
        "status": "Running"
    }


# -------------------------------
# Health
# -------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# -------------------------------
# Upload PDF
# -------------------------------

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    pdf_bytes = await file.read()

    doc = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.split_text(text)

    embeddings = embedding_model.encode(
        chunks
    ).tolist()

    try:
        ids = collection.get()["ids"]

        if ids:
            collection.delete(ids=ids)

    except Exception:
        pass

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[str(i) for i in range(len(chunks))]
    )

    return {
        "filename": file.filename,
        "characters": len(text),
        "chunks": len(chunks),
        "message": "PDF uploaded successfully."
    }


# -------------------------------
# Ask Question (RAG)
# -------------------------------

@app.post("/ask")
def ask_question(query: Question):

    query_embedding = embedding_model.encode(
        query.question
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    context = "\n\n".join(results["documents"][0])

    prompt = f"""
You are an AI Content Research Assistant.

Use ONLY the context below to answer the question.

Context:
{context}

Question:
{query.question}

If the answer is not in the context, say:
"I couldn't find that information in the uploaded document."
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "question": query.question,
        "retrieved_chunks": results["documents"][0],
        "answer": response["message"]["content"]
    }

# -------------------------------
# Summarize Document
# -------------------------------

@app.post("/summarize")
def summarize():

    docs = collection.get()["documents"]

    if not docs:
        return {"error": "No document uploaded."}

    text = "\n\n".join(docs[:10])

    prompt = f"""
Summarize the following document in clear bullet points.

{text}
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "summary": response["message"]["content"]
    }


# -------------------------------
# Generate Content Ideas
# -------------------------------

@app.post("/generate-ideas")
def generate_ideas(req: PromptRequest):

    prompt = f"""
Generate 10 high-quality content ideas about:

{req.prompt}

Return only the ideas as a numbered list.
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "ideas": response["message"]["content"]
    }


# -------------------------------
# LinkedIn Post Generator
# -------------------------------

@app.post("/linkedin")
def linkedin(req: PromptRequest):

    prompt = f"""
Write a professional LinkedIn post about:

{req.prompt}

Include:
- Hook
- Main content
- CTA
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "linkedin_post": response["message"]["content"]
    }

# -------------------------------
# Blog Outline Generator
# -------------------------------

@app.post("/blog")
def blog(req: PromptRequest):

    prompt = f"""
Create a detailed blog outline about:

{req.prompt}

Include:
- Title
- Introduction
- Main headings
- Conclusion
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "blog_outline": response["message"]["content"]
    }


# -------------------------------
# YouTube Script Generator
# -------------------------------

@app.post("/youtube")
def youtube(req: PromptRequest):

    prompt = f"""
Write a short YouTube script about:

{req.prompt}

Include:
- Hook
- Body
- Ending CTA
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "youtube_script": response["message"]["content"]
    }


# -------------------------------
# Hashtag Generator
# -------------------------------

@app.post("/hashtags")
def hashtags(req: PromptRequest):

    prompt = f"""
Generate 20 relevant social media hashtags for:

{req.prompt}

Return only hashtags.
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "hashtags": response["message"]["content"]
    }


# -------------------------------
# Database Statistics
# -------------------------------

@app.get("/stats")
def stats():
    try:
        data = collection.get()

        return {
            "documents": len(data["documents"]) if data["documents"] else 0,
            "ids": len(data["ids"]) if data["ids"] else 0
        }

    except Exception as e:
        return {
            "error": str(e)
        }