function SurveyStorage(dbQueryAdapter, dbQuery) {

    async function addSurvey(name, userId) {
        const newObj = {
            name: name?.trim(),
            json: "{}",
            surveytheme: "{}",
            userId,
            responsescount: 0,
            status: "draft",
            type: "public"
        };

        newObj.id = await dbQueryAdapter.create("surveys", newObj);
        return newObj;
    }

    async function storeSurvey(id, name, json, userId, surveytheme) {
        const jsonObj = typeof json === "string" ? JSON.parse(json) : json;
        const jsonStr = JSON.stringify(jsonObj);
        const themeStr = typeof surveytheme === "string" ? surveytheme : JSON.stringify(surveytheme);

        const status = jsonObj.status || "draft";
        const type = jsonObj.surveyType || "public";

        const updated = {
            id,
            name,
            json: jsonStr,
            surveytheme: themeStr,
            userId,
            status,
            type
        };

        await dbQueryAdapter.update("surveys", updated);
        return updated;
    }

    async function getSurvey(id) {
        const results = await dbQueryAdapter.retrieve("surveys", [
            { name: "id", op: "=", value: id }
        ]);
        return results[0] || null;
    }

    async function getSurveys() {
        return dbQueryAdapter.retrieve("surveys", []);
    }

    async function deleteSurvey(id) {
        return dbQueryAdapter.delete("surveys", id);
    }

    async function changeName(id, name) {
        return dbQueryAdapter.update("surveys", { id, name });
    }

    async function postResults(postId, json) {
        const newObj = {
            postid: postId,
            json: JSON.stringify(json)
        };

        newObj.id = await dbQueryAdapter.create("results", newObj);

        if (dbQuery) {
            await dbQuery(
                `
                    UPDATE surveys
                    SET responsescount = COALESCE(responsescount, 0) + 1
                    WHERE id = $1
                `,
                [postId]
            );
        } else {
            const surveys = await dbQueryAdapter.retrieve("surveys", [
                { name: "id", op: "=", value: postId }
            ]);

            if (surveys.length > 0) {
                const survey = surveys[0];
                const newCount = (survey.responsescount || 0) + 1;

                await dbQueryAdapter.update("surveys", {
                    id: postId,
                    responsescount: newCount
                });
            }
        }

        return newObj;
    }

    async function getResults(postId) {
        const results = await dbQueryAdapter.retrieve("results", [
            { name: "postid", op: "=", value: postId }
        ]);

        const data = results.map(r => {
            try {
                return JSON.parse(r.json);
            } catch {
                return r.json;
            }
        });

        return { id: postId, data };
    }

    return {
        addSurvey,
        storeSurvey,
        getSurvey,
        getSurveys,
        deleteSurvey,
        changeName,
        postResults,
        getResults,
        dbQuery
    };
}

export default SurveyStorage;
