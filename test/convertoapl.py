import os
import json

def convert_to_apl(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        data = json.loads(content)

    relevant_data = {}
    for item in data['nodes']:
        relevant_data[item['id']] = {
            'type': item['type'],
            'data': item['data'],
            }
    edges = []
    for item in data['edges']:
        edges.append({
            'source': item['source'],
            'target': item['target']
        })

    # print(relevant_data)
    # print(edges)
    output_file_path = os.path.splitext(file_path)[0] + '_converted.apl'
    output_file_path = os.path.join(os.getcwd(), 'test', os.path.basename(output_file_path))
    with open(output_file_path, 'w') as output_file:
        line = ""
        for edge in edges:
            # print(relevant_data[edge['source']])
            if relevant_data[edge['source']]['type'] == 'apl-start':
                if relevant_data[edge['target']]['type'] == 'ability':
                    line += f"actions={relevant_data[edge['target']]['data']['abilityName']}\n"
            else:
                line += f"actions+={relevant_data[edge['target']]['data']['abilityName']}\n"
        output_file.write(line)
    
    print(f'File converted and saved as: {output_file_path}')
if __name__ == "__main__":
    file_path = os.path.join(os.getcwd(), 'test', 'test_file_to_convert.json')
    convert_to_apl(file_path)