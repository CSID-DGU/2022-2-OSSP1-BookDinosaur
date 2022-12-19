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