const aiportService = require('../services/airport.service');

async function getAirports(req, res){
    try {
        const airports = await aiportService.getAllAirports();
        res.status(200).jsom(airports);
    } catch (error) {
        console.error('Error fetching airports: ', error);
        res.status(500).json({message: 'Internal serverv error'});
    }
}



async function getAirpoByIdentifier(req, res) {
    const { identifier } = req.params;
    try {
        const airport = await aiportService.getAirportDetails(identifier);

        if(!airport){
            return res.status(404).json({message: 'Airport not found'});
        }

        res.status(200).json(airport);
    } catch (error) {
        if(error.message.includes('Invalid airport identifier')){
            return res.status(400).json({
                message: error.message
            });
        }
        console.error('Error fetching airport details: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
}


module.exports = {
    getAirports,
    getAirpoByIdentifier
};