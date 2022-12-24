
## Customer Workflows


### 1) Bank App to onboard customers at a TARGET bank

Bank is using a Fintech, third-party application to facilitate onboarding clients and moving their accounts over to a new bank.

With account portability and the application, the client can share their banking data and products across all of their other accounts with the new bank.

Single bank portability experience.

==
#### Context
Plat is the company.
Plat provides an app to ABC bank (powered by Plat or white-labeled)

#### User Journey 
Client is new to ABC bank

ABC bank says you can open an account or use our onboarding wizard (Plat) to transfer over old accounts and gain premium benefits.

**Wizard**:
1. Who all do you bank with
2. Do you give permission to pull the data in
	* **For each bank**: OAuth redirection for each bank and give bank permission to give data bank
3. **(ADD)** Detection of Direct Deposit and Recurring Payments
4. **(ADD)** KYC Based on Transactions and Risk Appetite
5. Plat/ABC bank evaluates value of relationship
	* (Code function)
	* Proxy for credit access score (appease CFPB) - made-up; look at transaction history (simple)
	* Bank could do a soft-pull on from credit bureaus (some banks now offer on soft-pull only) - onboarding (not specific to us)
	* Above/Below profile benchmarks via proxy vs. FICO
	* Workflow:
		* If FICO pull it
		* If FICO above the line, we are ok
		* If FICO below the line, use proxy alternative based on historical transaction data from other banks (similarity to good vs. bad profiles or simple heuristics)
		* Volume of inflow/outflow
			* Customer A has 10 outflows and 1 inflow
			* Customer B has 30 outflows and 1 inflow
			* Customer B and A both manage same net cash position - Customer B is "more responsible" - history of managing larger types of outflows against inflows and budgeting.
			* How to know if late on a payment
6. Plat/ABC bank makes additional offers to the customer based on data received
7. Customer is onboarded, simplifies (fewer bank accounts), better pricing

**Admin Site**:
* Configure the valuation model parameters, preferences, and offers

**Problems**:
1. **(SIGNIFICANT)** **Can't use OAuth**: Bank (or app) needs to be registered with each other bank *OR* Bank (or app) needs to be connected to a #dataaccessplatform to bypass the registration process and go straight to OAuth. What if 2 of 3 banks are on the access platform and bank # 3 isn't?
	* What if API registration cannot pass through data aggregator (e.g. you use Plaid but the other bank requires a seperate registration for 4th party app) - I don't think happening today because that would trigger 3rd party risk requirements, unless handled through a click-through agreement.
2. **(SIGNIFICANT)** **Can't perform API registration on the fly programatically** - increases reliance on data aggregators.
3. **(UX)** OAuth redirect is required for each bank connected.
4. **(CDE)** No FICO / industry scores via FDX API
5. **(CX)** Customer ability to shop around is still slow because this only looks at ONE bank at a time.



### 2) Platform for Price and Product Shopping (Portability)

**Use Case A**:
Example there are 3 banks within 5 miles of you that you want to explore after moving.
If we use the above workflow (1) - we need to do the auth step 3 times * 3 banks = 9x. 

It's not good for shopping when comparing to say bankrate.com

**Use Case B**:
I want to shop around for a single bank account for all of my banking needs instead of using multiple disparate banks. I want better pricing. (Bankrate.com - using bank data)


#### Offering A: Data Aggregators
Data aggregators **already** have data across all the banks **AND** already solve the API registration problem because connections are pre-existing to banks.

In this case the data aggregator offers services and products directly to customers to make offerings directly to customers.


Platform -  I pre-register banks on the platform (target community and regional banks)
1. Solves the API registration piece partially for anyone already on the platform.
2. Customer authenticates ONCE for each bank to the platform and then can shop MULTIPLE banks at the same time
	1. Still have to do for EACH bank - but only have to do it once across multiple banks to get offers from other banks.

