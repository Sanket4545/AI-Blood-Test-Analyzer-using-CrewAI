import os
from langchain_community.chat_models import ChatCohere
from crewai_tools import FileReadTool
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool

# Set environment variables for the API keys
os.environ["COHERE_API_KEY"] = "Your_cohere_api_key"
os.environ["SERPER_API_KEY"] = "your_serper_api_key"


# Initialize language model and tools
llm = ChatCohere()
filereadtool = FileReadTool()
searchtool = SerperDevTool()

# Define CrewAI agents and tasks
planner = Agent(
    role="Summary generator",
    goal="Generate a summary from the blood test report: {report}",
    backstory=("You are a Blood Report Analyser, you will be provided the blood report content you have to summarize the report and get important information from that report because we have to use this summary to fetch the articles from the internet."),
    allow_delegation=False,
    verbose=True,
    tools=[filereadtool],
    llm=llm
)

webreseacher = Agent(
    role="Web Researcher",
    goal="Find relevant health articles...",
    backstory=("You are a web researcher you will be provided summary of a blood report you should fetch the articles related to that summary using the serper tool and your health recommandation for example what should eat and what precautions need to take and return the responce in josn "
               "for example:"
                 "article_info:..."
                 "article_link:..."
                 "and after this give health recommandation in one seperate object after all the articles"
                  "Health_recommandation:..."
                  "do not change this format I am using this format for further use so this is standard do not change it"),
    allow_delegation=False,
    verbose=True,
    tools=[searchtool],
    llm=llm
)

plan = Task(
    description="1. Read the blood test report and generate a summary...",
    expected_output="A detailed summary including the patient's age, name and important values",
    agent=planner
)

write = Task(
    description="1. Retrieve articles related to the blood test report summary...",
    expected_output="Relevant health articles with links and give your reccomandation to the paitent in given format",
    agent=webreseacher
)

# Initialize the crew with both agents and tasks
crew = Crew(
    agents=[planner, webreseacher],
    tasks=[plan, write],
    verbose=2
)
