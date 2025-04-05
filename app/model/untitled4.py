# -*- coding: utf-8 -*-
"""
Flipkart Product Review Sentiment Analysis Model
"""

import numpy as np
import pandas as pd
import re
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pickle
import warnings
import sys
warnings.filterwarnings("ignore")
warnings.simplefilter("ignore")

# Function to clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text

# Function to clean price
def clean_price(price):
    if pd.isna(price):
        return None
    price = str(price).replace('₹', '').replace(',', '')
    cleaned = re.sub(r'[^0-9.]', '', price)
    return cleaned if cleaned else None

# Try to load the pre-trained model
try:
    with open('sentiment_model.pkl', 'rb') as file:
        model = pickle.load(file)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Model not found. Training a new model...")
    try:
        # Load dataset
        df = pd.read_csv('flipkart.csv', encoding='latin1')
        
        # Clean data
        df = df.dropna(subset=['Summary'])
        df['Review'] = df['Review'].fillna('No review')
        
        # Clean Price
        df['Price_Cleaned'] = df['Price'].apply(clean_price)
        df['Price_Cleaned'] = pd.to_numeric(df['Price_Cleaned'], errors='coerce')
        df = df.dropna(subset=['Price_Cleaned'])
        
        # Clean Rate
        df['Rate'] = pd.to_numeric(df['Rate'], errors='coerce')
        df = df.dropna(subset=['Rate'])
        df['Rate'] = df['Rate'].astype(int)
        
        # Clean text
        df['Review'] = df['Review'].apply(clean_text)
        df['Summary'] = df['Summary'].apply(clean_text)
        
        # Download VADER lexicon if needed
        try:
            nltk.data.find('sentiment/vader_lexicon.zip')
        except LookupError:
            nltk.download('vader_lexicon')
        
        # Initialize VADER
        sia = SentimentIntensityAnalyzer()
        
        # Apply VADER to Summary column
        df['Sentiment_Score'] = df['Summary'].apply(lambda x: sia.polarity_scores(x)['compound'])
        
        # Classify sentiment based on score
        def classify_sentiment(score):
            if score >= 0.05:
                return 'Positive'
            elif score <= -0.05:
                return 'Negative'
            else:
                return 'Neutral'
        
        df['Sentiment_From_Text'] = df['Sentiment_Score'].apply(classify_sentiment)
        
        # Train model
        from sklearn.model_selection import train_test_split
        from sklearn.linear_model import LogisticRegression
        
        X = df[['Price_Cleaned']]
        y = df['Sentiment_From_Text']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = LogisticRegression(max_iter=1000)
        model.fit(X_train, y_train)
        
        # Save model
        with open('sentiment_model.pkl', 'wb') as file:
            pickle.dump(model, file)
        
        print("Model trained and saved!")
    except Exception as e:
        print(f"Error training model: {str(e)}")
        print("Continuing with text-based sentiment analysis only...")
        model = None

# Download VADER lexicon if not already downloaded
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize VADER
sia = SentimentIntensityAnalyzer()

def get_confidence_level(score):
    """Convert sentiment score to confidence percentage"""
    # For VADER scores: -1 to 1 scale
    # Convert to percentage: 0-100%
    abs_score = abs(score)
    # Map 0-1 to 50-100% (neutral is 50%, strong sentiment is 100%)
    confidence = 50 + (abs_score * 50)
    return confidence

def get_user_input():
    print("\n===== Flipkart Product Review Sentiment Analysis =====")
    product_review = input("Enter your product review: ")
    
    price = None
    try:
        price_input = input("Enter product price (optional, press Enter to skip): ")
        if price_input.strip():
            # Clean price input (remove currency symbols and commas)
            price_input = price_input.replace('₹', '').replace(',', '')
            price = float(price_input)
    except ValueError:
        print("Invalid price input. Using text-based sentiment only.")
    
    return product_review, price

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
    
    # Model-based prediction (if price is provided)
    model_sentiment = None
    model_confidence = None
    if price is not None and model is not None:
        try:
            # Get prediction
            model_sentiment = model.predict([[price]])[0]
            
            # Get confidence probabilities
            proba = model.predict_proba([[price]])[0]
            class_indices = {label: idx for idx, label in enumerate(model.classes_)}
            model_confidence = proba[class_indices[model_sentiment]] * 100
        except Exception as e:
            print(f"Error making prediction based on price: {str(e)}")
    
    return text_sentiment, confidence, model_sentiment, model_confidence

def main():
    # Check if command line arguments are provided
    if len(sys.argv) > 1:
        review = sys.argv[1]
        price = None
        if len(sys.argv) > 2 and sys.argv[2].strip():
            try:
                price_input = sys.argv[2].replace('₹', '').replace(',', '')
                price = float(price_input)
            except ValueError:
                pass  # Just continue without price
                
        # Get sentiment predictions
        text_sentiment, confidence, model_sentiment, model_confidence = analyze_sentiment(review, price)
        
        # Display results - this will be parsed by the Node.js wrapper
        print(f"Sentiment: {text_sentiment if not model_sentiment else model_sentiment}")
        print(f"Confidence level: {confidence:.1f}%" if not model_confidence else f"Confidence level: {model_confidence:.1f}%")
        return
        
    # Interactive mode
    while True:
        review, price = get_user_input()
        
        # Get sentiment predictions
        text_sentiment, confidence, model_sentiment, model_confidence = analyze_sentiment(review, price)
        
        # Display results
        print("\n===== Analysis Results =====")
        print(f"Review: \"{review}\"")
        print(f"Sentiment: {text_sentiment}")
        print(f"Confidence level: {confidence:.1f}%")
        
        if model_sentiment and model_confidence:
            print(f"Price-based sentiment: {model_sentiment}")
            print(f"Price-based confidence: {model_confidence:.1f}%")
        
        # Ask if user wants to continue
        continue_input = input("\nAnalyze another review? (y/n): ").lower()
        if continue_input != 'y':
            print("Thank you for using the sentiment analyzer!")
            break

if __name__ == "__main__":
    main()

