import requests
import gzip
import io
import xml.etree.ElementTree as ET
import json
import os
from datetime import datetime, timedelta

def process_epg():
    url = "https://iptv-epg.org/files/epg-tr.xml.gz"
    response = requests.get(url)
    
    with gzip.GzipFile(fileobj=io.BytesIO(response.content)) as f:
        xml_content = f.read()
    
    root = ET.fromstring(xml_content)
    channels = {ch.attrib['id']: ch.find('display-name').text for ch in root.findall('channel')}
    
    # Türkiye saati (GMT+3)
    turkey_time = datetime.utcnow() + timedelta(hours=3)
    
    results = []

    for prog in root.findall('programme'):
        start_str = prog.attrib['start'].split(' ')[0]
        stop_str = prog.attrib['stop'].split(' ')[0]
        
        start_dt = datetime.strptime(start_str, "%Y%m%d%H%M%S")
        stop_dt = datetime.strptime(stop_str, "%Y%m%d%H%M%S")
        
        if start_dt <= turkey_time <= stop_dt:
            remaining = int((stop_dt - turkey_time).total_seconds() / 60)
            results.append({
                "channel": channels.get(prog.attrib['channel'], prog.attrib['channel']),
                "title": prog.find('title').text if prog.find('title') is not None else "Bilinmiyor",
                "start": start_dt.strftime("%H:%M"),
                "stop": stop_dt.strftime("%H:%M"),
                "remaining": remaining
            })

    output = {
        "last_updated": turkey_time.strftime("%d-%m-%Y %H:%M"),
        "programs": results[:100]
    }

    os.makedirs('data', exist_ok=True)
    with open('data/epg.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

if name == "main":
    process_epg()
