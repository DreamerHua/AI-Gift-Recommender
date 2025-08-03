import firebase_admin  
from firebase_admin import firestore, credentials  
import json
import time



cred = credentials.Certificate(r"D:\AI Projects\13-AI礼物推荐助手\ai-gift-recommender-d6076-firebase-adminsdk-fbsvc-6485470691.json")  
firebase_admin.initialize_app(cred)  
db = firestore.client()  


print("连接成功，尝试读取1条数据...")
try:
    # 加超时限制（10秒），避免无限卡住
    start_time = time.time()
    doc = db.collection("sessions").limit(1).get(timeout=10)  # 重点：添加timeout参数
    print("读取到的数据量：", len(doc))
except Exception as e:
    print(f"读取失败（耗时{time.time()-start_time:.1f}秒）：", str(e))

# # 读取集合数据（替换为你的集合名，如 "sessions"）  
# docs = db.collection("sessions").stream()  
# data = [doc.to_dict() for doc in docs]

# # 保存为 JSON  
# with open("data.json", "w") as f:  
#     json.dump(data, f, indent=2)  