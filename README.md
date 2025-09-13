# 📊 D2 Ontology Lab Data Visualizations

Data visualizations created as part of the **D2 Ontology Lab research study**.  
These visualizations explore hierarchical data structures using **D3.js**.

## 🖼️ Showcase

- **Tree Map** and **Circle Packing**: Developed and viewed in [ObservableHQ](https://observablehq.com).  
- **Network Graph (Baseline) Visualization**: Built with D3.js and deployed on a local server (standalone HTML).  

### 🎥 Demo Videos
##### Tree Map:
[![Tree Map Demo](https://img.youtube.com/vi/3mEUm3YyM54/0.jpg)](https://youtu.be/3mEUm3YyM54)

##### Circle Packing:
[![Circle Packing Demo](https://img.youtube.com/vi/2TzsnzGQRoY/0.jpg)](https://youtu.be/2TzsnzGQRoY)

##### Network Graph (baselines):
[![Network Graph Demo](https://img.youtube.com/vi/I9XvBcPzfns/0.jpg)](https://youtu.be/I9XvBcPzfns)

The network graph visualization:
1. A resused visualization provided and made by Dr. Bo Fu
2. Nodes are collapsable
3. Darker nodes means it can collapse and there are subclasses within, lighter nodes means there are no further subclasses

The circle packing visualization:
1. The positioning of the circles are hardcoded in "predestined positions"
2. Users can only enter circle if there is subclasses within
3. Circles can only highlight and enter if hovered above their layer
4. Can not go back one, it will take user back to the beginning

The tree map visualization:
1. The positioning and json is hardcoded in "predestined positions"
2. Overlapping is visually seen

## 🛠️ Tech Stack
- **D3.js** for data visualization  
- **ObservableHQ** notebooks for prototyping & collaboration  
- **HTML/CSS/JS** for local baseline implementation  

## 🚀 How to Run
- Open the ObservableHQ notebooks to explore Tree Map and Circle Packing.  
- Run the network graph visualization locally:  
  ```bash
  python3 -m http.server
