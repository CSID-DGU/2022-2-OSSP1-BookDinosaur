import sys
import json
import numpy as np
from sklearn.decomposition import TruncatedSVD

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import warnings

from tensorflow.keras.layers import Input, Embedding, Flatten, Dot, Dense, Concatenate
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.utils import plot_model
from sklearn.model_selection import train_test_split
import seaborn as sns
import matplotlib.pyplot as plt
warnings.filterwarnings('ignore')

data = pd.read_csv('/content/rating.csv')
books = pd.read_csv('/content/Book.csv')

train, test = train_test_split(data, test_size = 0.2)

# layer 쌓기
book_input = Input(shape=(1, ), name='book_input_layer')
user_input = Input(shape=(1, ), name='user_input_layer')

number_of_unique_user = len(data.User_id.unique())
number_of_unique_book_id = len(data.book_id.unique())

book_embedding_layer = Embedding(number_of_unique_book_id + 1, 8, name='book_embedding_layer')
user_embedding_layer = Embedding(number_of_unique_user + 1, 8, name='user_embedding_layer')

book_vector_layer = Flatten(name='book_vector_layer')
user_vector_layer = Flatten(name='user_vector_layer')

concate_layer = Concatenate()

dense_layer1 = Dense(128, activation='relu')
dense_layer2 = Dense(32, activation='relu')

result_layer = Dense(1)

# 쌓기
book_embedding = book_embedding_layer(book_input)
user_embedding = user_embedding_layer(user_input)

book_vector = book_vector_layer(book_embedding)
user_vector = user_vector_layer(user_embedding)

concat = concate_layer([book_vector, user_vector])
dense1 = dense_layer1(concat)
dense2 = dense_layer2(dense1)

result = result_layer(dense2)

model = Model(inputs=[user_input, book_input], outputs=result)

#model.summary()

#plot_model(model, to_file='./dense_predict_model.png', show_shapes=True, show_layer_names=True)

model.compile(loss = 'mse', optimizer='adam', metrics=['mse'])

#history = model.fit([train.User_id, train.book_id], train.Rating, epochs=100, verbose=1)

#plt.plot(history.history['loss'])
#plt.xlabel('epochs')
#plt.ylabel('training error')

#model.evaluate([test.User_id, test.book_id], test.Rating)

predictions = model.predict([test.User_id.head(10), test.book_id.head(10)])

tmp_book_data = np.array(list(set(data.book_id)))[:50]
tmp_user = np.array([1 for i in range(50)])

# id는 1부터 시작인데 argsort를 하면 0부터 되므로 1을 더한다.
recommended_book_ids = (-predictions).argsort()[:5] + 1

# 숫자 표현 형식 지정
np.set_printoptions(precision=3, suppress=True)

# 인자로 데이터 받아옴
r = json.loads(sys.argv[1])

# 원본 행렬 r 생성
r = np.array(r)

# 예측해야 할 도서 인덱스 저장(점수가 0인 것)
nonDatas = []
for i, rate in enumerate(r[len(r)-1]):
    if (rate == 0):
           nonDatas.append(i)

# Simple SVD
u, s, vh = np.linalg.svd(r, full_matrices=False)

# 특이값 개수(잠재요인 차원) K는 4 설정
# 테스트 결과 경험적으로 4가 가장 적절하다고 판단
K = 4
svd = TruncatedSVD(n_components=K)
svd.fit(r)

u = u[:, :K]
s = svd.singular_values_
vh = vh[:K, :]

# 예측 평점 행렬 계산
us = np.matmul(u, np.diag(s))
result = np.matmul(us, vh)

# 정렬하여 추천 도서 가져오기 위한 과정
# 평점 높은 순으로 인덱스 정렬하여 넘겨줌

# 튜플 만드는 과정
recommand = []
count = 0
for i, rate in enumerate(result[len(result)-1]):
    if (count >= len(nonDatas)):
        break
    if (i == nonDatas[count]):
        recommand.append((i, rate))
        count += 1

# 평점 순 정렬
recommand.sort(key=lambda x:x[1], reverse=True)

# 인덱스만 추출, 책 3권까지만(NUMOFBOOK)
NUMOFBOOK = 3
ret = []
for i, element in enumerate(recommand):
    if (i < NUMOFBOOK):
        ret.append(element[0])
    else:
        break

print(ret)
