import json
import pprint

word_file = open('word_list.txt', 'r')
word_list = []

for pk, line in enumerate(word_file):
    word, part_of_speech, definition = line.split(' ', 2)
    word_list.append({
        "model": "wordstudy.Word",
        "pk": pk + 1,
        "fields": {
            "word": word,
            "part_of_speech": part_of_speech,
            "definition": definition.strip()
        }
    })

word_file.close()


with open('word_list.json', 'w') as json_file:
    json_file.write(json.dumps(word_list, indent=4, separators=(',',':')))
