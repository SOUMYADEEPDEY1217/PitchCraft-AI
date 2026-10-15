"""
CLI wrapper for demo seed script located in backend root.
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from seed import seed_database

if __name__ == "__main__":
    clear_flag = "--clear" in sys.argv
    seed_database(clear_existing=clear_flag)
