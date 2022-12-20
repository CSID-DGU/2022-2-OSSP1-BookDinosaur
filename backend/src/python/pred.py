import numpy as np

from model import *

tmp_book_data = np.array(list(set(data.book_id)))[:50]
tmp_user = np.array([1 for i in range(50)])

# id는 1부터 시작인데 argsort를 하면 0부터 되므로 1을 더한다.
recommended_book_ids = (-predictions).argsort()[:5] + 1

print(books[books['Id'].isin(recommended_book_ids)])