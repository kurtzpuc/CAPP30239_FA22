import pandas as pd

df = pd.read_csv("CRAB_CPUE_FOR_WEB.csv")
print(df)
print(df.columns)
df_crab = df[['LATITUDE', 'LONGITUDE', 'SURVEY_YEAR',
       'COMMON_NAME', 'CPUE']]
df_crab = df[df["COMMON_NAME"] == "snow crab"]
df_crab = df_crab[df_crab["SURVEY_YEAR"] == 2016]
print(df_crab)
df_crab = df_crab.groupby(["LATITUDE", "LONGITUDE", "SURVEY_YEAR", "COMMON_NAME"], dropna=True).sum("CPUE").reset_index()
print(df_crab)
df_crab.to_csv('crab_years/2016.csv')

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
