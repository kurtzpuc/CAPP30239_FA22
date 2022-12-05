import pandas as pd
from functools import reduce

df = pd.read_csv("CRAB_CPUE_FOR_WEB.csv")
print(df)
print(df.columns)
df_crab = df[['LATITUDE', 'LONGITUDE', 'SURVEY_YEAR',
       'COMMON_NAME', 'CPUE']]
df_crab = df[df["COMMON_NAME"] == "snow crab"]
#df_crab = df_crab[df_crab["SURVEY_YEAR"] == 2016]
print(df_crab)
df_crab = df_crab.groupby(["LATITUDE", "LONGITUDE", "SURVEY_YEAR", "COMMON_NAME"], dropna=True).sum("CPUE").reset_index()
print(df_crab)
df_crab.to_csv('crab.csv')

df_temp = df[['LATITUDE','LONGITUDE','SURVEY_YEAR','BOTTOM_TEMPERATURE', 'SURFACE_TEMPERATURE','CPUE']]
df_temp = df_temp.groupby(["LATITUDE", "LONGITUDE", "SURVEY_YEAR"], dropna=True).agg({"CPUE": ['median'], "BOTTOM_TEMPERATURE": ['median'], "SURFACE_TEMPERATURE": ['median']}).reset_index()
df_temp = df_temp.dropna()
print(df_temp)
print(df_temp["CPUE"])
df_temp.to_csv('temps_by_area_year.csv')

df_temps_year = df[['SURVEY_YEAR','BOTTOM_TEMPERATURE', 'SURFACE_TEMPERATURE','CPUE']]
df_temps_year_sum = df_temps_year.groupby(["SURVEY_YEAR"], dropna=True).agg({"CPUE": ['sum'], "BOTTOM_TEMPERATURE": ['median'], "SURFACE_TEMPERATURE": ['median']}).reset_index()
print(df_temps_year)
df_temps_year = df_temps_year.groupby(["SURVEY_YEAR"], dropna=True).agg({"CPUE": ['median'], "BOTTOM_TEMPERATURE": ['median'], "SURFACE_TEMPERATURE": ['median']}).reset_index()
df_temps_year = df_temps_year.dropna()
df_temps_year_sum = df_temps_year_sum.dropna()



catch = pd.read_csv("crab.csv")
acidity = pd.read_csv("ocean-acidity_fig-1.csv")
temps = pd.read_csv("temps_by_year.csv")
depth = pd.read_csv("marine-species_fig-1.csv")
sea_level = pd.read_csv("sea-level_fig-1.csv")

catch = catch.groupby(["SURVEY_YEAR"], dropna=True).sum("CPUE").reset_index()
catch.rename(columns = {'SURVEY_YEAR':'Year', "Unnamed: 0": 'CPUE'}, inplace = True)
acidity = acidity[['Hawaii Year', 'Hawaii pH', 'Hawaii pCO2']]
acidity = acidity.dropna()
acidity["Hawaii Year"] = acidity["Hawaii Year"].astype('int')
acidity = acidity.groupby(["Hawaii Year"], dropna=True).mean(["Hawaii pH", "HawaiipCO2"]).reset_index()
acidity.rename(columns = {'Hawaii Year':'Year'}, inplace = True)

temps = temps[["SURVEY_YEAR","BOTTOM_TEMPERATURE","SURFACE_TEMPERATURE"]]
temps = temps.dropna()
temps.rename(columns = {'SURVEY_YEAR':'Year'}, inplace = True)

depth = depth[["Year", "Eastern Bering Sea - Latitude","Eastern Bering Sea - Depth"]]
depth = depth.dropna()

sea_level = sea_level[["Year", "NOAA - Adjusted sea level (inches)"]]
sea_level = sea_level.dropna()
sea_level.rename(columns = {'NOAA - Adjusted sea level (inches)':'Sea_Level'}, inplace = True)


data_frames = [catch, acidity, temps, depth, sea_level]


df_merged = reduce(lambda  left,right: pd.merge(left,right,on=['Year'],
                                            how='outer'), data_frames)
print(df_merged.columns)
df_merged = df_merged.dropna()
df_merged.to_csv('conditions.csv')