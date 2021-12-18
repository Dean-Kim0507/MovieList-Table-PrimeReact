import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMovieData } from "../_store/utils/reducerFunctions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Sidebar } from "primereact/sidebar";
import { MultiSelect } from "primereact/multiselect";
import { Chip } from "primereact/chip";
import { ScrollPanel } from "primereact/scrollpanel";
import "../css/MovieList.css";

const MovieList = () => {
  const dispatch = useDispatch();
  const [initData, setInitData] = useState();
  const [selectedId, setSelectedId] = useState();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleRight, setVisibleRight] = useState(false);

  useEffect(() => {
    dispatch(fetchMovieData())
      .then((state) => {
        //convert from rating(xx/5.0) to percent (xx%/100%)
        return ratingToPercent(state.data);
      })
      .then((data) => {
        setInitData(data);
        setLoading(false);
      });
  }, []);

  const ratingToPercent = (data) => {
    return data.map((row) => {
      row.rating = `${(row.rating * 20).toFixed(2)}%`;
      return row;
    });
  };

  const radioButtonBodyTemplate = (rowData) => {
    return (
      <RadioButton
        name="movie_id"
        value={rowData._id}
        onChange={(e) => setSelectedId(e.value)}
        checked={selectedId === rowData._id}
      />
    );
  };

  const makeUniqueArr = (dupliArr) => {
    let uniqueArr = [];
    //GEt rid of duplication
    dupliArr.forEach((element) => {
      if (!uniqueArr.includes(element)) {
        uniqueArr.push(element);
      }
    });
    return uniqueArr;
  };

  const filters = () => {
    return {
      title: { value: null, matchMode: FilterMatchMode.CONTAINS },
      releaseDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      length: { value: null, matchMode: FilterMatchMode.CONTAINS },
      director: { value: null, matchMode: FilterMatchMode.IN },
      certification: { value: null, matchMode: FilterMatchMode.EQUALS },
      rating: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
  };

  const directorRowFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={makeUniqueArr(initData.map((data) => data.director))}
        itemTemplate={directorItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="director"
        placeholder="All"
        className="p-column-filter"
        maxSelectedLabels={1}
      />
    );
  };

  const directorItemTemplate = (option) => {
    return (
      <div className="p-multiselect-director-option">
        <span value={option} className="director">
          {option}
        </span>
      </div>
    );
  };

  const certificationBodyTemplate = (rowData) => {
    return (
      <span
        className={`customer-badge certification-${rowData.certification
          .toLowerCase()
          //get rid of space
          .replace(/(\s*)/g, "")}`}
      >
        {rowData.certification}
      </span>
    );
  };

  const certificationRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={makeUniqueArr(initData.map((data) => data.certification))}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        itemTemplate={certificationItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const certificationItemTemplate = (option) => {
    return (
      <span
        className={`customer-badge certification-${option
          .toLowerCase()
          //get rid of space
          .replace(/(\s*)/g, "")}`}
      >
        {option}
      </span>
    );
  };

  const onSelection = (e) => {
    console.log(e);
    setVisibleRight(true);
    setSelectedMovie(e.value);
  };

  return (
    <div className="container">
      {initData && (
        <div className="movie_table">
          {selectedMovie && (
            <Sidebar
              className="p-sidebar-right"
              visible={visibleRight}
              position="right"
              onHide={() => setVisibleRight(false)}
              style={{ width: "40rem", height: "80vh" }}
              icons={
                <h3 style={{ width: "100%", color: "#636366" }}>
                  MOVIE DETAILS
                </h3>
              }
            >
              <div>
                <ScrollPanel
                  className="p-scrollpanel-wrapper"
                  style={{ width: "100%", height: "70vh", marginTop: "-2rem" }}
                  maskStyle={{ backgroundColor: "red" }}
                >
                  <p className="p-scrollpanel-title">{selectedMovie.title}</p>
                  <p className="p-scrollpanel-subTitle">
                    Directed by {selectedMovie.director}
                  </p>
                  <div className="p-scrollpanel-cast">
                    Cast:{" "}
                    {selectedMovie.cast.map((cast) => (
                      <Chip key={cast} className="p-chip-text" label={cast} />
                    ))}
                  </div>
                  <div className="p-scrollpanel-genre">
                    Genre:{" "}
                    {selectedMovie.genre.map((genre) => (
                      <Chip key={genre} className="p-chip-text" label={genre} />
                    ))}
                  </div>
                  <div>
                    <p className="p-scrollpanel-plot">Plot:</p>
                    <p className="p-scrollpanel-plotText">
                      {selectedMovie.plot}
                    </p>
                  </div>
                </ScrollPanel>
                <p className="p-sidebar-footer">
                  All movie data are from Wikipedia and iMOb.
                </p>
              </div>
            </Sidebar>
          )}
          <div className="movieList_title">Favorite Movie List</div>
          <div className="movieList">
            <DataTable
              className="p-datatable-movies"
              value={initData}
              paginator
              rows={10}
              emptyMessage="No movies found."
              filterDisplay="row"
              rowHover
              filters={filters()}
              loading={loading}
              selection={selectedMovie}
              style={{ width: "90vw" }}
              onSelectionChange={(e) => onSelection(e)}
            >
              <Column
                field="radioButton"
                body={radioButtonBodyTemplate}
                selectionMode="single"
                headerStyle={{ width: "3em" }}
              ></Column>
              <Column
                field="title"
                header="Title"
                filter
                style={{ minWidth: "15rem" }}
                showClearButton={false}
                showFilterMenu={false}
                filterHeaderStyle={{ minWidth: "15rem" }}
                filterPlaceholder="Search by title"
              ></Column>
              <Column
                field="releaseDate"
                header="Year"
                style={{ minWidth: "12rem" }}
                filter
                filterField="releaseDate"
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder="Search by year"
              ></Column>
              <Column
                field="length"
                header="Running Time"
                style={{ minWidth: "12rem" }}
                filter
                filterField="length"
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder="Search by time"
              ></Column>
              <Column
                field="director"
                header="Director"
                style={{ minWidth: "14rem" }}
                filter
                filterField="director"
                showFilterMenu={false}
                showClearButton={false}
                filterMenuStyle={{ width: "14rem" }}
                filterElement={directorRowFilterTemplate}
              ></Column>
              <Column
                field="certification"
                header="Certification"
                style={{ minWidth: "10rem" }}
                body={certificationBodyTemplate}
                filter
                filterField="certification"
                showFilterMenu={false}
                showClearButton={false}
                filterElement={certificationRowFilterTemplate}
              ></Column>
              <Column
                field="rating"
                header="Rating"
                style={{ minWidth: "12rem" }}
                filter
                filterField="rating"
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder="Search by rating"
              ></Column>
            </DataTable>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
