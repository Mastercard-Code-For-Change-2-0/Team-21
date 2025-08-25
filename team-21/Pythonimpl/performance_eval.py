import os
import json
from groq import Groq
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from bson import ObjectId


def is_valid_objectid(user_id):
    """
    Check if the provided user_id is a valid 24-character ObjectId string.
    """
    return len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id)


def get_answers_from_mongodb():
    """
    Connects to a MongoDB Atlas database, fetches answers from the 'career_progress' collection,
    and returns them as a dictionary where question numbers map to the answers.
    """
    answers = {}
    try:
        mongo_uri = "mongodb+srv://satyam:root@cluster0.xxktm1z.mongodb.net/MC?retryWrites=true&w=majority&appName=Cluster0"
        client = MongoClient(mongo_uri)

        client.admin.command('ismaster')
        print("Connected to MongoDB Atlas successfully.")

        db = client["codeforchange"]
        collection = db["career_progress"]

        user_id_str = "some_user_id"  # Replace this with actual user ID
        if is_valid_objectid(user_id_str):
            user_id = ObjectId(user_id_str)
            user_document = collection.find_one({"user_id": user_id})

            if user_document:
                for i, question_answer in enumerate(user_document.get("questions", []), start=1):
                    answers[str(i)] = question_answer.get("answer", "No answer provided.")
        else:
            print("Invalid ObjectId format provided!")
        
    except ConnectionFailure as e:
        print(f"Error connecting to MongoDB Atlas: {e}")
    except OperationFailure as e:
        print(f"Authentication error or issue with database/collection: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed.")
    
    return answers


def evaluate_professional_progress(answers):
    """
    Evaluates professional progress based on answers to 7 questions using the Groq LLM.

    Args:
        answers (dict): A dictionary mapping question numbers to the user's answers.

    Returns:
        dict: A dictionary containing the individual scores for each question and the
              overall professional progress rating, or None if an error occurs.
    """
    questions = {
        1: "Describe a major professional challenge you've overcome in the last year.",
        2: "What new skills have you acquired recently, and how have you applied them?",
        3: "How do you handle constructive criticism and feedback?",
        4: "Describe a time you collaborated effectively with a team to achieve a goal.",
        5: "What are your career goals for the next three years?",
        6: "How have you contributed to a positive work culture?",
        7: "What do you do to stay updated in your field?"
    }

    scoring_rubric = """
    Evaluation Criteria (Score 1-5):
    - Score 1 (Low): Answer is brief, lacks detail, or misses the point. Shows minimal effort or progress.
    - Score 2: Some relevance, but the answer is generic and lacks specific examples.
    - Score 3 (Medium): Addresses the question with some detail, but could be more specific or reflective.
    - Score 4: Good detail with some specific examples. Demonstrates clear thought and some progress.
    - Score 5 (High): Answer is well-structured, detailed, and provides specific, quantifiable examples.
      Demonstrates significant progress, deep reflection, and a strong sense of purpose.
    """

    prompt_content = f"""
    You are a professional career evaluator. Your task is to rate the professional
    progress of an individual based on their answers to seven key questions.

    Use the following scoring rubric to guide your evaluation:
    {scoring_rubric}

    Here are the seven questions and the individual's answers:
    """

    for q_num, question_text in questions.items():
        user_answer = answers.get(str(q_num), "No answer provided.")
        prompt_content += f"\n\nQuestion {q_num}: {question_text}\nAnswer: {user_answer}"

    prompt_content += f"""\n\nProvide the rating for each question (1-5) and an overall professional progress
    rating (1-5). Use the following JSON format for your output. DO NOT include any
    other text or explanation.

    {{
      "q1_score": [score],
      "q2_score": [score],
      "q3_score": [score],
      "q4_score": [score],
      "q5_score": [score],
      "q6_score": [score],
      "q7_score": [score],
      "overall_rating": [overall score]
    }}
    """

    try:
        api_key = "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"
        client = Groq(api_key=api_key)

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_content}],
            model="llama3-8b-8192",
            response_format={"type": "json_object"}
        )

        llm_response_text = chat_completion.choices[0].message.content
        result = json.loads(llm_response_text)
        return result
    
    except Exception as e:
        print(f"An error occurred with the Groq API call: {e}")
        return None


# --- Main Script Execution ---

if __name__ == "__main__":
    user_answers = get_answers_from_mongodb()

    if not user_answers:
        print("Failed to retrieve answers from the database. Evaluation cannot proceed.")
    else:
        print("\n--- Professional Progress Evaluation ---")
        evaluated_scores = evaluate_professional_progress(user_answers)
        
        if evaluated_scores:
            print("Evaluation successful. Results:")
            print(json.dumps(evaluated_scores, indent=2))
        else:
            print("Evaluation failed. Check the Groq API key and network connection.")
