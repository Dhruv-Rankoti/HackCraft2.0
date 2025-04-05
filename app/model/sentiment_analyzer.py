#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import json
import re
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pickle
import warnings
import os
import numpy as np

warnings.filterwarnings("ignore")
warnings.simplefilter("ignore")

# Function to clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text

# Function to clean price
def clean_price(price):
    if not price:
        return None
    price = str(price).replace('₹', '').replace(',', '')
    cleaned = re.sub(r'[^0-9.]', '', price)
    return float(cleaned) if cleaned else None

# Initialize VADER
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon', quiet=True)

sia = SentimentIntensityAnalyzer()

# Try to load the pre-trained model
model = None
model_path = os.path.join(os.path.dirname(__file__), 'sentiment_model.pkl')
try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
except Exception as e:
    pass  # Silently continue without model if there's an issue

def get_confidence_level(score):
    """Convert sentiment score to confidence percentage"""
    abs_score = abs(score)
    # Map 0-1 to 50-100% (neutral is 50%, strong sentiment is 100%)
    confidence = 50 + (abs_score * 50)
    return confidence

def analyze_sentiment(review_text, price=None):
    # Text-based sentiment using VADER
    cleaned_review = clean_text(review_text)
    sentiment_scores = sia.polarity_scores(cleaned_review)
    compound_score = sentiment_scores['compound']
    
    # Classify sentiment based on VADER score
    if compound_score >= 0.05:
        text_sentiment = 'Positive'
    elif compound_score <= -0.05:
        text_sentiment = 'Negative'
    else:
        text_sentiment = 'Neutral'
    
    # Calculate confidence
    confidence = get_confidence_level(compound_score)
    
    # Model-based prediction (if price is provided and model exists)
    model_sentiment = None
    model_confidence = None
    
    if price is not None and model is not None:
        try:
            price_float = float(price)
            # Get prediction
            model_sentiment = model.predict([[price_float]])[0]
            
            # Get confidence probabilities
            proba = model.predict_proba([[price_float]])[0]
            class_indices = {label: idx for idx, label in enumerate(model.classes_)}
            model_confidence = proba[class_indices[model_sentiment]] * 100
        except Exception:
            pass  # Silently continue without model prediction
    
    # Use model prediction if available, otherwise use text sentiment
    final_sentiment = model_sentiment if model_sentiment else text_sentiment
    final_confidence = model_confidence if model_confidence is not None else confidence
    
    return {
        "sentiment": final_sentiment,
        "confidence": round(final_confidence, 1)
    }

if __name__ == "__main__":
    # Expect arguments: review_text, price (optional)
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No review text provided"}))
        sys.exit(1)
    
    review_text = sys.argv[1]
    price = None
    
    if len(sys.argv) > 2 and sys.argv[2].strip():
        try:
            price = clean_price(sys.argv[2])
        except:
            pass
    
    result = analyze_sentiment(review_text, price)
    print(json.dumps(result)) 