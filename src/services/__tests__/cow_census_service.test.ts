import { cowCensusService } from 'services';
import db from '../../db/db';
import { ICowCensus } from 'db/models/cow_census';
import dotenv from 'dotenv';

dotenv.config();

const idHerd = '187dc38d-bc3a-4eb4-ac99-74e04de04d48'; // from seeder
const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

let idCowCensus = '';
const invalidCowCensusId = '2025e145-b453-40d7-b5e6-335f59be66cb';

const cowCensusData: Omit<ICowCensus, 'id'> = {
  herdId: idHerd,
  plotId: idPlot,
  photoId: idPhoto,
  bcs: [2, 3, 4],
  notes: 'Sphinx of black quartz, judge my vow',
  tag: 'F123456',
};

describe('cowCensusService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createCowCensus', () => {
    it('Can create cowCensus', async () => {
      const cowCensus: ICowCensus = await cowCensusService.createCowCensus(cowCensusData);

      expect(cowCensus.id).toBeDefined();
      expect(cowCensus.herdId).toBe(cowCensusData.herdId);
      expect(cowCensus.plotId).toBe(cowCensus.plotId);
      expect(cowCensus.photoId).toBe(cowCensusData.photoId);
      expect(cowCensus.bcs).toEqual(cowCensusData.bcs);
      expect(cowCensus.notes).toBe(cowCensusData.notes);
      expect(cowCensus.tag).toBe(cowCensusData.tag);
      idCowCensus = cowCensus.id;
    });
  });

  describe('getCowCensuses', () => {
    it('Can get cowCensus', async () => {
      const cowCensus: ICowCensus = await cowCensusService.getCowCensuses({ id: idCowCensus }).then((res: ICowCensus[]) => res[0]);

      expect(cowCensus.id).toBe(idCowCensus);
      expect(cowCensus.herdId).toBe(cowCensusData.herdId);
      expect(cowCensus.plotId).toBe(cowCensusData.plotId);
      expect(cowCensus.photoId).toBe(cowCensusData.photoId);
      expect(cowCensus.bcs).toEqual(cowCensusData.bcs);
      expect(cowCensus.notes).toBe(cowCensusData.notes);
      expect(cowCensus.tag).toBe(cowCensusData.tag);
    });

    it('Returns empty array if no cowCensuses to get', async () => {
      expect(await cowCensusService.getCowCensuses({ id: invalidCowCensusId })).toStrictEqual([]);
    });
  });

  describe('editCowCensuses', () => {
    it('Updates cowCensus field', async () => {
      const updatedCowCensus1: ICowCensus = await cowCensusService.editCowCensuses({ bcs: [3, 4, 5], notes: 'Cow was fat today' }, { id: idCowCensus }).then((res: ICowCensus[]) => res[0]);
      expect(updatedCowCensus1.id).toBe(idCowCensus);
      expect(updatedCowCensus1.herdId).toBe(cowCensusData.herdId);
      expect(updatedCowCensus1.plotId).toBe(cowCensusData.plotId);
      expect(updatedCowCensus1.photoId).toBe(cowCensusData.photoId);
      expect(updatedCowCensus1.bcs).toEqual([3, 4, 5]);
      expect(updatedCowCensus1.notes).toEqual('Cow was fat today');
      expect(updatedCowCensus1.tag).toEqual(cowCensusData.tag);

      const updatedCowCensus2: ICowCensus = await cowCensusService.getCowCensuses({ id: idCowCensus }).then((res: ICowCensus[]) => res[0]);
      expect(updatedCowCensus2.id).toBe(idCowCensus);
      expect(updatedCowCensus2.herdId).toBe(cowCensusData.herdId);
      expect(updatedCowCensus2.plotId).toBe(cowCensusData.plotId);
      expect(updatedCowCensus2.photoId).toBe(cowCensusData.photoId);
      expect(updatedCowCensus2.bcs).toEqual([3, 4, 5]);
      expect(updatedCowCensus2.notes).toEqual('Cow was fat today');
      expect(updatedCowCensus2.tag).toEqual(cowCensusData.tag);
    });

    it('Returns empty array if no cowCensuses to edit', async () => {
      expect(await cowCensusService.editCowCensuses({ notes: 'Cow was not fat today' }, { id: invalidCowCensusId })).toStrictEqual([]);
    });
  });

  describe('deleteCowCensuses', () => {
    it('Deletes existing cowCensus', async () => {
      await cowCensusService.deleteCowCensuses({ id: idCowCensus });
      expect(await cowCensusService.getCowCensuses({ id: idCowCensus })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no cowCensuses to delete', async () => {
      expect(await cowCensusService.deleteCowCensuses({ id: invalidCowCensusId })).toStrictEqual(0);
    });
  });
});