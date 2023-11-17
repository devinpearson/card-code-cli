# Petrol Card

This template is a example of a petrol card using the programmable card account. ITs limiting transactions to only be able to be used at petrol stations. This is done by checking the merchant category code (MCC) of the transaction. If the MCC is not a petrol station, the transaction is declined.

## Merchant codes for fuel

- `5499` : Miscellaneous Food Stores - Convenience Stores and Specialty Markets
- `5541` : Service Stations
- `5172` : Petroleum and Petroleum Products
- `5542` : Automated Fuel Dispensers

This code was created by Hennie Spies.
