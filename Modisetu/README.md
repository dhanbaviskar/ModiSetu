# ModiSetu 🖋️
### Modi Script to Devanagari Converter using AI

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)

---
## 📥 Download Trained Model

The model file is large so it is hosted on Google Drive.

👉 [Click here to Download modisetu_model.pth](https://drive.google.com/file/d/1aC20ZwfxzdWuMhtN03HJZopyAcKA4CdE/view?usp=drive_link)

### After Downloading:
1. Download the file from above link
2. Place it inside `/model` folder like this:
```
ModiSetu/
└── model/
    └── modisetu_model.pth
```

## 📌 About The Project
ModiSetu is an AI-powered web application that converts 
handwritten Modi script characters to Devanagari in real time.
Modi script is an ancient writing system used in Maharashtra 
that is now at risk of being forgotten.

## ✨ Features
- Real-time handwriting recognition on HTML5 Canvas
- ResNet18 deep learning model with Transfer Learning
- 85–92% accuracy for character prediction
- Flask-powered backend API
- Clean and responsive web interface

## 🛠️ Tech Stack
| Technology | Purpose |
|---|---|
| Python | Core programming |
| PyTorch + ResNet18 | Deep Learning model |
| Transfer Learning | Model training |
| Flask | Web backend |
| HTML5 Canvas | Drawing interface |
| JavaScript | Frontend interaction |

## 📊 Model Performance
- Accuracy: 85–92%
- Architecture: ResNet18 with Transfer Learning
- Task: Multi-class character classification

## 🚀 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ModiSetu.git
cd ModiSetu
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Flask app
```bash
python app.py
```

### 4. Open browser
```
http://localhost:5000
```

## 📸 Screenshots
(Add your project screenshots here)

## 🙋‍♀️ About Me
**Dhanashree Baviskar** — Aspiring Data Analyst  
📧 dnbaviskar2004@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/dhanashree-baviskar-045059281)