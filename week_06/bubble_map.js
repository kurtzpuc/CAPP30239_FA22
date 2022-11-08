chart = BubbleMap(population, {
    value: ([population]) => +population,
    position([, stateid, countyid]) {
      const county = countymap.get(stateid + countyid);
      return county && centroid(county);
    },
    title([population, stateid, countyid]) {
      const state = statemap.get(stateid);
      const county = countymap.get(stateid + countyid);
      return `${county?.properties.name}, ${state?.properties.name}\n${(+population).toLocaleString("en")}`;
    },
    features: nation,
    borders: statemesh,
    width: 975,
    height: 610
  })