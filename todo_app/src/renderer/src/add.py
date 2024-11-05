import sys

def add(a, b):
    return int(a) + int(b)
def sub(m,n):
    return int(m) - int(n)

def fibonacci(n):
    n = int(n)
    if n == 0 | n==1:
        return 0
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
        #return fibonacci(n-1) + fibonacci(n-2)

if __name__ == "__main__":
    if len(sys.argv) == 3:
        print(add(sys.argv[1], sys.argv[2]))
        print("substraction result:")
        print(sub(sys.argv[1], sys.argv[2]))
    elif len(sys.argv) == 2:
        print(fibonacci(sys.argv[1]))
