from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.database import engine, Base
from app import model


from app.routes import customers, orders, products
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory System API")
frontend_urls = os.environ.get("FRONTEND_URL")
origins = [url.strip() for url in frontend_urls.split(",") if url.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"], # Allow all headers
)
# Include the routed endpoints
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
