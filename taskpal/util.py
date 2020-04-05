import json


def byteToDict(inp):
    return json.loads(inp.decode())
