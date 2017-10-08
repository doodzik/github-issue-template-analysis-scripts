import json
import matplotlib.pyplot as plt
import numpy as np
from textwrap import wrap
from pprint import pprint

filename = 'closed-bugs-time.json'
min_tick = -100
max_tick = 300
tick_lenght = 50
bin_count = 20

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
# labels[0] = '<' + str(min_tick)
ax.set_xticklabels(labels)

plt.xlabel('Change in Bug Report processing time [%]')
plt.ylabel('Project count')
plt.title("\n".join(wrap('Change in time required to close a Bug Report after the Introduction of Issue Templates (in percent)')))
plt.grid(True)

plt.show()

fig.savefig("./{0}.png".format(filename), transparent=True)
plt.close(fig)

