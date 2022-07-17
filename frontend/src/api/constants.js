import axios from 'axios';

const ACAD_YEAR = '2022-2023';

const getModuleInfo = async (moduleCode) => {
  const data = await axios
    .get(`https://api.nusmods.com/v2/${ACAD_YEAR}/modules/${moduleCode}.json`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
  return data;
};

export { ACAD_YEAR, getModuleInfo };
