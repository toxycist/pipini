import sys
from email_validator import validate_email, EmailNotValidError
import requests
import os
from dotenv import load_dotenv
import openai
import json
import smtplib
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
import logging


# Since this is a simple application I use sys.exit() with every error
def main():
    load_dotenv()
    env = Environment(loader=FileSystemLoader("./Prompts"))
    logging.basicConfig(
        filename="api.log", format="%(asctime)s %(message)s", filemode="w"
    )
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    allowed_modes = ("stock", "news")

    receiver_email, mode = validate_input(allowed_modes)

    # I use elif & variables (company/category) for easier scalability later with new modes & functionality
    if mode == allowed_modes[0]:
        company = "IBM"
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={company}&apikey={os.getenv("ALPHAVANTAGE_API")}'

        data = get_api_data(url)

        logger.info("alphavantage api succesful")

        OPENAI_INSTRUCTIONS = env.get_template("stock.j2").render(
            email=receiver_email, company=company, data=data
        )
    elif mode == allowed_modes[1]:
        category = "business"
        url = f"https://gnews.io/api/v4/top-headlines?category={category}&lang=en&max=5&nullable=image&apikey={os.getenv("GNEWS_API")}"

        data = get_api_data(url)

        logger.info("gnews api succesful")

        OPENAI_INSTRUCTIONS = env.get_template("news.j2").render(
            email=receiver_email, category=category, data=data
        )

    email_content = generate_email(
        api=os.getenv("OPENAI_API"), data=data, instructions=OPENAI_INSTRUCTIONS
    )

    logger.info("openai api succesful")

    message = MIMEText(email_content["email_content"], "plain")
    message["Subject"] = email_content["title"]
    message["From"] = os.getenv("USERNAME")
    message["To"] = receiver_email

    send_email(message)

def validate_input(allowed_modes: list) -> tuple:
    if len(sys.argv) != 3:
        sys.exit("Enter email and type: ")

    ''' I decided to use an external package for email validation since it's safer '''
    try:
        email_info = validate_email(sys.argv[1], check_deliverability=True)
        receiver_email = email_info.normalized
    except EmailNotValidError as e:
        sys.exit(str(e))

    mode = sys.argv[2].lower().strip()
    if not mode in allowed_modes:
        sys.exit(
            f"This mode has not yet been implemented. Current modes: {allowed_modes[0]} and {allowed_modes[1]}."
        )

    return receiver_email, mode


def get_api_data(url: str) -> str:
    try:
        r = requests.get(url)
    except requests.exceptions.ConnectionError:
        sys.exit("Connection error trying to reach the API")
    except requests.exceptions.RequestException:
        sys.exit("Stock data API is not working")
    else:
        return r.text


def generate_email(api: str, data: str, instructions: str) -> str:
    try:
        client = openai.OpenAI(api_key=api)

        response = client.responses.create(
            model="gpt-4.1-nano",
            instructions=instructions,
            input=data,
            store=False,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "data_response",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "email_content": {"type": "string"},
                        },
                        "required": ["title", "email_content"],
                        "additionalProperties": False,
                    },
                    "strict": True,
                }
            },
        )
    except openai.APIConnectionError:
        sys.exit("OpenAI API connection error")
    except openai.RateLimitError:
        sys.exit("OpenAI API rate limit exceeded")
    except openai.AuthenticationError:
        sys.exit("OpenAI API key invalid")
    except openai.APIConnectionError:
        sys.exit("OpenAI API unknown issue")
    else:
        return json.loads(response.output_text)


def send_email(message: MIMEText) -> None:
    try:
        with smtplib.SMTP(
            os.environ["SMTP_SERVER"], int(os.environ["SMTP_PORT"])
        ) as server:
            server.starttls()
            server.login(os.environ["GMAIL_ACCOUNT"], os.environ["GMAIL_PASSWORD"])
            server.sendmail(message["From"], message["To"], message.as_string())
    except smtplib.SMTPConnectError:
        sys.exit("Failed SMTP connection")
    except smtplib.SMTPAuthenticationError:
        sys.exit("SMTP authentication went wrong")
    except smtplib.SMTPSenderRefused:
        sys.exit("Invalid sender email adress")
    except smtplib.SMTPException:
        sys.exit("Unkown SMTP library error")


if __name__ == "__main__":
    main()
