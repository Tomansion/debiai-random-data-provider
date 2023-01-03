
// This data provider will provide a number of project with a certain number of random data

const sampleNumberToCreate = [
    // 10,
    // 100,
    // 1000,
    // 10000,
    50000,
    // 100000,
    // 1000000,
    // 2000000,
    // 3000000,
    // 4000000,
    // 5000000,
    // 6000000,
    // 7000000,
    // 8000000,
    // 9000000,
    // 10000000,
]

const projectToCreate = sampleNumberToCreate.map(sampleNumber => {
    return { name: `P with ${sampleNumber} samples`, sampleNumber }
})

const randomContext = () => {
    const context = ["A", "B", "C", "D", "E", "F", "G"]
    return context[Math.floor(Math.random() * context.length)]
}

exports.info = (req, res) => {
    // Return the list of projects with their columns and results
    // 'project_1' is the project id, it will be used as a path parameter in the API
    // 'name' is the name of the project
    // 'columns' is the list of columns of the project data
    // 'expectedResults' is the list of columns of the model results, it can be empty
    // 'nbSamples' [optional] is the number of samples in the project data
    /* projects = {
        project_1: {
            name: "Project 1",
            columns: [
                { name: "Context 1", type: "text" },
                { name: "Ground thruth 1", type: "number" },
                { name: "Input 1", type: "number" },
            ],
            expectedResults: [
                { name: "Model prediction", type: "number" },
                { name: "Model error", type: "number" },
            ],
            nbSamples: 3,
        }
    } */

    try {
        const projects = {}
        for (const project of projectToCreate) {
            projects[project.name] = {
                name: project.name,
                columns: [
                    { name: "Random Context", type: "text" },
                    { name: "Random GDT", type: "number" },
                    { name: "Input same as ID", type: "number" },
                ],
                expectedResults: [
                    { name: "Model prediction same as ID", type: "number" },
                    { name: "Model error", type: "number" },
                ],
                nbSamples: project.sampleNumber,
                nbModels: 2,
            }
        }

        res.status(200).send(projects)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.dataIdList = (req, res) => {
    // Return the list of the project data ids
    try {
        const requestedProjectId = req.openapi.pathParams.view;
        const start = new Date()
        const requestedSampleNumber = projectToCreate.find(project => project.name == requestedProjectId).sampleNumber

        // In case of a nulber of sample > 10000, we will ask for a sequensed amount of sample ID
        // Set variables only if from & to in query parameters*
        const from = req.query.from
        const to = req.query.to

        console.log(`Requested ${requestedSampleNumber} samples from`, from, "to", to);
        if (from !== undefined && to !== undefined) {
            // Fetch data with from and to filter;
            const projectDataIds = Array(to - from + 1).fill().map((_, i) => i + 1 + from)
            console.log('ArrayCreation time: %dms', new Date() - start)
            console.log("Sending data ids");
            res.status(200).send(projectDataIds);
        }
        else {
            const projectDataIds = Array(requestedSampleNumber).fill().map((_, i) => i + 1)
            console.log('ArrayCreation time: %dms', new Date() - start)
            console.log("Sending data ids");
            res.status(200).send(projectDataIds)
        }
        console.log('Execution time: %dms', new Date() - start)


    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.data = (req, res) => {
    // Return the data for the given data ids
    try {
        const requestedDataIds = req.body; // List of data ids requested by DebiAI

        projectData = {}
        for (const dataId of requestedDataIds)
            projectData[dataId] = [
                randomContext(),
                Math.random() * 100,
                dataId
            ]

        res.status(200).send(projectData)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.modelList = (req, res) => {
    // Return the list of the project models
    try {
        const requestedProjectId = req.openapi.pathParams.view;
        const requestedSampleNumber = projectToCreate.find(project => project.name == requestedProjectId).sampleNumber

        const projectModels = [
            // 1 sample 1 result
            {
                id: "model_1",
                name: "Model 1",
                nbResults: requestedSampleNumber
            },
            // 2 samples 1 result
            {
                id: "model_2",
                name: "Model 2",
                nbResults: Math.floor(requestedSampleNumber / 2)
            },
        ]

        // The model ids are 'model_1' and 'model_2', they will be requested by DebiAI
        // The name is optional, it will be replaced by the model id if not provided
        // The nbResults is optional, it will be replaced by 0 if not provided

        res.status(200).send(projectModels)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.modelEvaluatedDataIdList = (req, res) => {
    // Return a list of data ids that the model have been evaluated on
    try {
        const requestedProjectId = req.openapi.pathParams.view;
        const requestedModelId = req.openapi.pathParams.modelId;
        const requestedSampleNumber = projectToCreate.find(project => project.name == requestedProjectId).sampleNumber

        if (requestedModelId == "model_1") {
            // 1 sample 1 result
            const projectDataIds = Array(requestedSampleNumber).fill().map((_, i) => i + 1)
            res.status(200).send(projectDataIds)
        }
        else if (requestedModelId == "model_2") {
            // 2 samples 1 result
            const projectDataIds = Array(Math.floor(requestedSampleNumber / 2)).fill().map((_, i) => (i * 2) + 1)
            res.status(200).send(projectDataIds)
        }
        else
            res.status(404).send("Model not found")

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.modelResults = (req, res) => {
    // Return the model results for the given data ids
    try {
        const requestedProjectId = req.openapi.pathParams.view;
        const requestedModelId = req.openapi.pathParams.modelId;
        const requestedDataIds = req.body;

        const results = {}
        for (const dataId of requestedDataIds) results[dataId] = [dataId, Math.random() * 100]
        res.status(200).send(results)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

// Selections
exports.selectionList = (req, res) => {
    // Return the project selections
    try {
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.selectionDataIdList = (req, res) => {
    // Return the list of a selection samples ids
    try {
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}