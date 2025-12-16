import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { FirestoreContext } from '@/context/FirestoreContext';

const createAssetMock = jest.fn();
const updateAssetMock = jest.fn();

import AssetForm from '../AssetForm';

describe('AssetForm', () => {
  beforeEach(() => {
    createAssetMock.mockReset();
    updateAssetMock.mockReset();
  });

  it('renders form fields and buttons', () => {
    const mockFirestore = {
      assets: [],
      loading: false,
      createAsset: createAssetMock,
      updateAsset: updateAssetMock,
      deleteAsset: jest.fn(),
      getAsset: jest.fn(),
      subscribeToAsset: jest.fn(),
    } as any;

    const { getByTestId, getByText } = render(
      <FirestoreContext.Provider value={mockFirestore}>
        <AssetForm />
      </FirestoreContext.Provider>
    );

    expect(getByTestId('input-Name')).toBeTruthy();
    expect(getByTestId('input-Description')).toBeTruthy();
    expect(getByTestId('input-Location')).toBeTruthy();

    expect(getByText('Add Attachment')).toBeTruthy();
    expect(getByText('Save Asset')).toBeTruthy();
  });

  it('submits new asset when required fields are provided', async () => {
    createAssetMock.mockResolvedValueOnce('new-id');

    const mockFirestore = {
      assets: [],
      loading: false,
      createAsset: createAssetMock,
      updateAsset: updateAssetMock,
      deleteAsset: jest.fn(),
      getAsset: jest.fn(),
      subscribeToAsset: jest.fn(),
    } as any;

    const { getByTestId, getByText } = render(
      <FirestoreContext.Provider value={mockFirestore}>
        <AssetForm />
      </FirestoreContext.Provider>
    );

    const nameInput = getByTestId('input-Name');
    const descInput = getByTestId('input-Description');

    fireEvent.changeText(nameInput, '  My Asset  ');
    fireEvent.changeText(descInput, 'A description');

    fireEvent.press(getByText('Save Asset'));

    await waitFor(() => expect(createAssetMock).toHaveBeenCalled());

    const calledWith = createAssetMock.mock.calls[0][0];
    expect(calledWith.name).toBe('My Asset');
    expect(calledWith.description).toBe('A description');
    expect(calledWith.attachments).toEqual([]);
  });
});
