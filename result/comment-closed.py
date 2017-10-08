import json
import matplotlib.pyplot as plt
import numpy as np
from textwrap import wrap
from pprint import pprint

def getData( filename ):
   with open(filename) as data_file:    
        raw_data = json.load(data_file)
   data = np.array(raw_data)
   return data;

filename = 'comment-not-closed.json'
min_tick = -80
max_tick = 200 
tick_lenght = 20
bin_count = 20 

# pprint(np.sort(data))

data1 = [np.clip(getData('comment-closed.json'), min_tick, max_tick)]
data2 = [np.clip(getData('comment-not-closed.json'), min_tick, max_tick)]
data3 = [np.clip(getData('comment-average.json'), min_tick, max_tick)]

hist, bins = np.histogram(data3, bins=bin_count)

fig, ax = plt.subplots()
# _, bins, patches = plt.hist(data, bins=bins)
plt.hist(data1, bins, alpha=0.5, label='closed bugs')
plt.hist(data2, bins, alpha=0.5, label='open bugs')

# plt.setp(patches, linewidth=0)
plt.xticks(np.arange(min_tick, max_tick+1, tick_lenght))
plt.xlim(min_tick, max_tick)

fig.canvas.draw()
labels = map(str, np.arange(min_tick, max_tick+1, tick_lenght))
labels[-1] = '>' + str(max_tick)
# labels[0] = '<' + str(min_tick)
ax.set_xticklabels(labels)

plt.xlabel('Change in the number of comments per Bug Report [%]')
plt.ylabel('Project count')
plt.title("\n".join(wrap('Change in number of comments per Bug Report after the introduction of Issue Templates.')))
plt.grid(True)

plt.legend(loc='upper right')
plt.show()

fig.savefig("./{0}.png".format(filename), transparent=True)
plt.close(fig) 

