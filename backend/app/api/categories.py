from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import FoodCategory
from app.schemas.schemas import FoodCategoryOut

router = APIRouter(prefix="/categories", tags=["Food Categories"])

@router.get("", response_model=List[FoodCategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(FoodCategory).order_by(FoodCategory.id.asc()).all()
