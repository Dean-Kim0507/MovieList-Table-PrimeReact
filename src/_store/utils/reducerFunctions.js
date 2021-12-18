import axios from "axios";
import { MOVIE_All_DATA } from "../../_constants";

export const fetchMovieData = async () => {
  try {
    const data = await axios
      .get(`https://skyit-coding-challenge.herokuapp.com/movies`)
      .then((response) => response.data);
    return {
      type: MOVIE_All_DATA,
      data,
    };
  } catch (error) {
    //it will go to error page
    console.log(error);
  }
};
