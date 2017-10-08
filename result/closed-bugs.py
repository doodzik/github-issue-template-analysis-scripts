import json
import matplotlib.pyplot as plt
import numpy as np
from textwrap import wrap
from pprint import pprint

filename = 'closed-bugs.json'
min_tick = -100
max_tick = 150
tick_lenght = 50
bin_count = 25

with open(filename) as data_file:
    raw_data = json.load(data_file)

data = np.array(raw_data)
# pprint(np.sort(data))

data = [np.clip(data, min_tick, max_tick)]

hist, bins = np.histogram(data, bins=bin_count)

fig, ax = plt.subplots()
_, bins, patches = plt.hist(data, bins=bins)

plt.setp(patches, linewidth=0)
plt.xticks(np.arange(min_tick, max_tick+1, tick_lenght))
plt.xlim(min_tick, max_tick)

fig.canvas.draw()
labels = map(str, np.arange(min_tick, max_tick+1, tick_lenght))
labels[-1] = '>' + str(max_tick)
labels[0] = '<' + str(min_tick)
ax.set_xticklabels(labels)

plt.xlabel('Change in the percentage of closed Bug Reports [%]')
plt.ylabel('Project count')
plt.title("\n".join(wrap('Change in percentage of closed Bug Reports after the Introduction of Issue Templates.')))
plt.grid(True)

plt.show()

fig.savefig("./{0}.png".format(filename), transparent=True)
plt.close(fig)

