import styled from "styled-components";

export const ProfileContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

export const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #f4616c 0%, #9c46ae 100%);
  padding: 30px;
  color: white;
  text-align: center;
`;

export const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  border: 3px solid white;
`;

export const ProfileName = styled.h2`
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 600;
`;

export const ProfileRole = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
`;

export const ProfileContent = styled.div`
  padding: 30px;
`;

export const Section = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FieldValue = styled.div`
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
  min-height: 44px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
`;

export const FieldInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

export const FieldTextarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #219a52;
    transform: translateY(-1px);
  }
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #7f8c8d;
    transform: translateY(-1px);
  }
`;

export const EmptyValue = styled.span`
  color: #999;
  font-style: italic;
`;

export const LogoutButton = styled.button`
  gap: 8px;
  padding: 12px 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;
