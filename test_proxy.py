import requests  

def test_proxy(port):  
    proxies = {  
        "http": f"http://127.0.0.1:{port}",  
        "https": f"http://127.0.0.1:{port}"  
    }  
    try:  
        r = requests.get("https://www.google.com", proxies=proxies, timeout=5)  
        print(f"端口 {port} 测试成功！状态码：{r.status_code}")  
    except Exception as e:  
        print(f"端口 {port} 失败：{str(e)}")  


# 代入候选端口测试（从截图里的127.0.0.1端口选）  
test_proxy(51007)  
test_proxy(51008)  
test_proxy(61960)