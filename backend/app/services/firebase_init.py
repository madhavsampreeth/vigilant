import firebase_admin 
from firebase_admin import credentials

def init_firebase():
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("service-account.json")
            firebase_admin.initialize_app(cred)
            print("✅ Firebase initialized")
    except Exception as e:
        print("❌ Firebase init error:", e)
init_firebase()        