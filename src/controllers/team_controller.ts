import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { teamService } from 'services';
import { CreateTeamRequest, UpdateTeamRequest } from 'validation/teams';
import { ITeam } from 'db/models/team';
import { BaseError } from 'errors';

const createTeam: RequestHandler = async (req: ValidatedRequest<CreateTeamRequest>, res, next) => {
  try {
    const {
      name, 
      acreSize,
      address,
      yrsRanch,
      yrsHolMang,
      // no code
    } = req.body;

    const newTeam = await teamService.createTeam({ name, acreSize, address, yrsRanch, yrsHolMang });

    res.status(201).json(newTeam);
  } catch (error) {
    next(error);
  }
};

const getTeam: RequestHandler = async (req, res, next) => {
  try {
    const id = req.query?.id as string;
    const name = req.query?.name as string;
    const userId = req.query?.userId as string;
    const code = req.query?.code as string;
    
    const teams : ITeam[] = await teamService.getTeams({ id, name, userId, code });
    if (teams.length === 0) throw new BaseError('Team not found', 404);
    else res.status(200).json(teams[0]);
  } catch (error) {
    next(error);
  }
};

const updateTeam: RequestHandler = async (req: ValidatedRequest<UpdateTeamRequest>, res, next) => {
  try {
    // Only allow user to update certain fields
    const {       
      name, 
      acreSize,
      address,
      yrsRanch,
      yrsHolMang,
      // no code 
    } = req.body;

    const updatedTeams = await teamService.editTeams(
      { name, acreSize, address, yrsRanch, yrsHolMang },
      { id: req.params.id },
    );

    if (updatedTeams.length === 0) throw new BaseError('Team not found', 404);
    else res.status(200).json(updatedTeams[0]);
  } catch (error) {
    next(error);
  }
};

const deleteTeam: RequestHandler = async (req, res, next) => {
  try {
    const teams : ITeam[] = await teamService.getTeams({ id: req.params.id });
    if (teams.length === 0) throw new BaseError('Team not found', 404);
    else {
      await teamService.deleteTeams({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const membershipController = {
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
};

export default membershipController;