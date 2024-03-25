class SummaryFile:
    def __init__(self, heading, filename):
        self.Heading = heading
        self.FileName = filename

class UserSummary:
    def __init__(self, customer_id):
        self.CustomerId = customer_id
        self.Summaries = []

    def add_summary(self, summary_file):
        self.Summaries.append(summary_file)