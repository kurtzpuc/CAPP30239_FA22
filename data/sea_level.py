import pandas as pd

df = pd.read_csv("sea-level_fig-1.csv")
print(df) 
df = df[df["NOAA - Adjusted sea level (inches)"] >0]
print(df)
df = df.rename(columns={"Year": "Year", "CSIRO - Adjusted sea level (inches)": "C", 
                    "CSIRO - Upper error bound (inches)":"c", "NOAA - Adjusted sea level (inches)" : "sea_level"})
df = df.round(decimals=2)
print(df)
df.to_csv('sea_level.csv')