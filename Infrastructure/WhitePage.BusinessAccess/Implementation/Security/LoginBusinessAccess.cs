﻿using System.Collections.Generic;
using WhitePage.BusinessAccess.Contracts.Security;
using WhitePage.Entities.CaseManagement;
using WhitePage.Entities.Security;
using WhitePage.ResourceAccess.Contracts.Security;
using WhitePage.Utilities.Security;

namespace WhitePage.BusinessAccess.Implementation.Security
{
    public class LoginBusinessAccess : ILoginBusinessAccess
    {
        private ILoginDataAccess loginDataAccess;

        public LoginBusinessAccess(ILoginDataAccess loginDataAccess)
        {
            this.loginDataAccess = loginDataAccess;
        }        

        public List<Claim> ValidateUser(string userName, string password, string ipAddress)
        {
            return this.loginDataAccess.ValidateUser(userName, EncryptionManager.Encrypt(password), ipAddress);
        }

        public List<UserRole> GetUserRoles()
        {
            return this.loginDataAccess.GetUserRoles();
        }

        public void AddPeaceMaker(PeaceMaker peaceMaker)
        {
            this.loginDataAccess.AddPeaceMaker(peaceMaker);
        }

        public void AddCounselor(Counselor counselor)
        {
            this.loginDataAccess.AddCounselor(counselor);
        }

        public void AddNewUserLogin(string userName, int roleId, string firstName, string lastName)
        {
            this.loginDataAccess.AddNewUserLogin(userName, roleId, firstName, lastName);
        }
        public int DeactivateUser(int userId)
        {
            return this.loginDataAccess.DeactivateUser(userId);
        }
    }
}
