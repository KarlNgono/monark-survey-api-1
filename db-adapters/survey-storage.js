let currentId = 1;

function SurveyStorage(dbQueryAdapter) {
  function addSurvey(name, createdby, createdby_id, callback) {
    const newObj = {
      name: name && name.trim() !== "" ? name : "New Survey " + currentId++,
      json: "{}",
      surveytheme: "{}",
      createdby,
      createdby_id,
      responsescount: 0
    };

    dbQueryAdapter.create("surveys", newObj, id => {
      newObj.id = id;
      callback(newObj);
    });
  }

  function storeSurvey(id, name, json, createdby, createdby_id, surveytheme, callback) {
    const jsonObj = typeof json === "string" ? JSON.parse(json) : json;
    const jsonStr = JSON.stringify(jsonObj);
    const themeStr = typeof surveytheme === "string" ? surveytheme : JSON.stringify(surveytheme);
    const cb = typeof callback === "function" ? callback : () => {};

    const status = jsonObj.status || "draft";
    const type = jsonObj.surveyType || "public";

    dbQueryAdapter.retrieve("surveys", [{ name: "id", op: "=", value: id }], results => {
      const current = results[0];
      const responsescount = current ? current.responsescount : 0;

      dbQueryAdapter.update(
          "surveys",
          {
            id,
            name,
            json: jsonStr,
            surveytheme: themeStr,
            createdby,
            createdby_id,
            responsescount,
            status,
            type
          },
          results => cb(results)
      );
    });
  }

  function getSurvey(id, callback) {
    dbQueryAdapter.retrieve("surveys", [{ name: "id", op: "=", value: id }], results => {
      callback(results[0]);
    });
  }

  function getSurveys(callback) {
    dbQueryAdapter.retrieve("surveys", [], results => callback(results));
  }

  function deleteSurvey(id, callback) {
    dbQueryAdapter.delete("surveys", id, results => callback(results));
  }

  function changeName(id, name, callback) {
    dbQueryAdapter.update("surveys", { id, name }, results => callback(results));
  }

  function postResults(postId, json, callback) {
    const newObj = {
      postid: postId,
      json: JSON.stringify(json)
    };

    dbQueryAdapter.create("results", newObj, id => {
      newObj.id = id;

      dbQueryAdapter.retrieve("surveys", [{ name: "id", op: "=", value: postId }], surveys => {
        if (surveys.length > 0) {
          const survey = surveys[0];
          const newCount = (survey.responsescount || 0) + 1;

          dbQueryAdapter.update("surveys", { id: postId, responsescount: newCount }, () => {
            callback(newObj);
          });
        } else {
          callback(newObj);
        }
      });
    });
  }

  function getResults(postId, callback) {
    dbQueryAdapter.retrieve("results", [{ name: "postid", op: "=", value: postId }], results => {
      const data = results.map(r => {
        try { return JSON.parse(r.json); }
        catch (e) { return r.json; }
      });
      callback({ id: postId, data });
    });
  }

  return {
    addSurvey,
    storeSurvey,
    getSurvey,
    getSurveys,
    deleteSurvey,
    changeName,
    postResults,
    getResults
  };
}

export default SurveyStorage;
