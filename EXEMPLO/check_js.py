import sys

def check_brackets(text):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for i, c in enumerate(text):
        if c in '([{':
            stack.append((c, i))
        elif c in ')]}':
            if not stack:
                return False, f"Unexpected {c} at index {i}"
            top, _ = stack.pop()
            if top != pairs[c]:
                return False, f"Mismatched {c} at index {i}, expected match for {top}"
    
    if stack:
        return False, f"Unmatched brackets remaining: {stack}"
    return True, "All good!"

with open('test_patched_modal.js', 'r', encoding='utf-8') as f:
    text = f.read()

# To ignore string literals which might contain brackets, we should parse carefully.
# However, just doing a raw bracket count could give a hint.
# But it's better to just use node to compile and print where the error is.
# Actually, node already said "Unexpected token ']'"
